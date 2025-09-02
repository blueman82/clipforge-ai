import { Queue } from 'bullmq'
import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import { uploadToS3 } from '@/lib/storage'

export interface ExportJobData {
  projectId: string
  userId: string
  quality: '1080p' | '4K'
  removeWatermark: boolean
  format: 'mp4' | 'mov'
}

export interface ExportJobResult {
  success: boolean
  exportUrl?: string
  thumbnailUrl?: string
  duration?: number
  fileSize?: number
  error?: string
}

// Export queue for processing high-quality video exports
export const exportQueue = new Queue<ExportJobData, ExportJobResult>('export', {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: 10,
    removeOnFail: 5,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
})

export class ExportWorker {
  private tempDir: string
  private ffmpegPath: string
  private ffprobePath: string

  constructor() {
    this.tempDir = process.env.TEMP_DIR || '/tmp/clipforge'
    this.ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg'
    this.ffprobePath = process.env.FFPROBE_PATH || 'ffprobe'
    this.ensureTempDir()
  }

  private ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true })
    }
  }

  async processExport(job: ExportJobData): Promise<ExportJobResult> {
    const { projectId, userId, quality, removeWatermark, format } = job

    try {
      // Get project from database
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { user: true },
      })

      if (!project) {
        throw new Error('Project not found')
      }

      if (project.userId !== userId) {
        throw new Error('Unauthorized')
      }

      // Check if user can remove watermark
      if (removeWatermark) {
        const canRemoveWatermark = await this.checkWatermarkRemoval(userId)
        if (!canRemoveWatermark) {
          throw new Error('Insufficient credits or subscription for watermark removal')
        }
      }

      // Get the preview/draft video path
      const previewPath = project.previewUrl
      if (!previewPath || !fs.existsSync(previewPath)) {
        throw new Error('Preview video not found. Please render the project first.')
      }

      // Create export filename
      const timestamp = Date.now()
      const exportFilename = `export-${projectId}-${quality}-${timestamp}.${format}`
      const outputPath = path.join(this.tempDir, exportFilename)

      // Process video with FFmpeg
      await this.processVideo(previewPath, outputPath, quality, removeWatermark, format)

      // Generate thumbnail
      const thumbnailFilename = `thumbnail-${projectId}-${timestamp}.jpg`
      const thumbnailPath = path.join(this.tempDir, thumbnailFilename)
      await this.generateThumbnail(outputPath, thumbnailPath)

      // Upload to S3
      const exportUrl = await uploadToS3(outputPath, `exports/${exportFilename}`)
      const thumbnailUrl = await uploadToS3(thumbnailPath, `thumbnails/${thumbnailFilename}`)

      // Get video metadata
      const metadata = await this.getVideoMetadata(outputPath)

      // Update project with export URL
      await prisma.project.update({
        where: { id: projectId },
        data: {
          exportUrl,
          thumbnailUrl,
          status: 'COMPLETED',
          progress: 100,
        },
      })

      // Deduct credits if watermark was removed
      if (removeWatermark) {
        await this.deductCredits(userId, quality)
      }

      // Clean up temp files
      fs.unlinkSync(outputPath)
      fs.unlinkSync(thumbnailPath)

      return {
        success: true,
        exportUrl,
        thumbnailUrl,
        duration: metadata.duration,
        fileSize: metadata.fileSize,
      }
    } catch (error) {
      console.error('Export failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Export failed',
      }
    }
  }

  private async processVideo(
    inputPath: string,
    outputPath: string,
    quality: '1080p' | '4K',
    removeWatermark: boolean,
    format: 'mp4' | 'mov'
  ): Promise<void> {
    const qualitySettings = {
      '1080p': {
        width: 1920,
        height: 1080,
        bitrate: '8000k',
        preset: 'slow',
        crf: 18,
      },
      '4K': {
        width: 3840,
        height: 2160,
        bitrate: '25000k',
        preset: 'slow',
        crf: 17,
      },
    }

    const settings = qualitySettings[quality]
    const args = [
      '-i', inputPath,
      '-vf', `scale=${settings.width}:${settings.height}:force_original_aspect_ratio=decrease,pad=${settings.width}:${settings.height}:(ow-iw)/2:(oh-ih)/2`,
      '-c:v', 'libx264',
      '-preset', settings.preset,
      '-crf', settings.crf.toString(),
      '-maxrate', settings.bitrate,
      '-bufsize', (parseInt(settings.bitrate) * 2).toString(),
      '-pix_fmt', 'yuv420p',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-ar', '48000',
      '-movflags', '+faststart',
    ]

    // Add watermark if not removed
    if (!removeWatermark) {
      args.splice(2, 0, '-vf')
      args.splice(3, 0, `drawtext=text='ClipForge AI':x=10:y=10:fontsize=24:fontcolor=white@0.8:box=1:boxcolor=black@0.5,${args[3]}`)
    }

    // Add format-specific settings
    if (format === 'mov') {
      args.push('-tag:v', 'hvc1')
    }

    args.push('-y', outputPath)

    return this.runFFmpeg(args)
  }

  private async generateThumbnail(videoPath: string, thumbnailPath: string): Promise<void> {
    const args = [
      '-i', videoPath,
      '-vf', 'thumbnail,scale=640:360',
      '-frames:v', '1',
      '-y', thumbnailPath,
    ]

    return this.runFFmpeg(args)
  }

  private async runFFmpeg(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn(this.ffmpegPath, args)

      let stderr = ''
      process.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      process.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`FFmpeg failed with code ${code}: ${stderr}`))
        }
      })

      process.on('error', (error) => {
        reject(error)
      })
    })
  }

  private async getVideoMetadata(videoPath: string): Promise<{ duration: number; fileSize: number }> {
    return new Promise((resolve, reject) => {
      const process = spawn(this.ffprobePath, [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        videoPath,
      ])

      let stdout = ''
      process.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      process.on('close', (code) => {
        if (code === 0) {
          try {
            const metadata = JSON.parse(stdout)
            const stats = fs.statSync(videoPath)
            resolve({
              duration: parseFloat(metadata.format?.duration || '0'),
              fileSize: stats.size,
            })
          } catch (error) {
            reject(error)
          }
        } else {
          reject(new Error(`ffprobe failed with code ${code}`))
        }
      })
    })
  }

  private async checkWatermarkRemoval(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, subscriptionStatus: true },
    })

    if (!user) return false

    // Check if user has active subscription or enough credits
    if (user.subscriptionStatus === 'active') return true
    if ((user.credits || 0) >= 10) return true

    return false
  }

  private async deductCredits(userId: string, quality: '1080p' | '4K'): Promise<void> {
    const creditsToDeduct = quality === '4K' ? 20 : 10

    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: {
          decrement: creditsToDeduct,
        },
      },
    })
  }
}

// Create and export the worker instance
export const exportWorker = new ExportWorker()