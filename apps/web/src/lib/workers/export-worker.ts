import { Queue } from 'bullmq'
import { redis } from '@/lib/redis'
import { prisma } from '@/lib/prisma'
import ffmpeg from 'fluent-ffmpeg'
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

  constructor() {
    this.tempDir = process.env.TEMP_DIR || '/tmp/clipforge'
    this.ensureTempDir()
  }

  private ensureTempDir() {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true })
    }
  }

  async processExport(data: ExportJobData): Promise<ExportJobResult> {
    try {
      // Get project data
      const project = await prisma.project.findFirst({
        where: {
          id: data.projectId,
          userId: data.userId,
        },
      })

      if (!project || !project.previewUrl) {
        throw new Error('Project not found or preview not available')
      }

      // Update project status
      await prisma.project.update({
        where: { id: data.projectId },
        data: { 
          status: 'PROCESSING',
          progress: 10,
        },
      })

      // Download the preview video
      const inputPath = await this.downloadPreview(project.previewUrl)
      
      // Generate output filename
      const outputFilename = `${project.id}-export-${data.quality}.${data.format}`
      const outputPath = path.join(this.tempDir, outputFilename)

      // Process video with FFmpeg
      const processedVideo = await this.processVideo({
        inputPath,
        outputPath,
        quality: data.quality,
        removeWatermark: data.removeWatermark,
        projectId: data.projectId,
      })

      // Generate thumbnail
      const thumbnailPath = await this.generateThumbnail(processedVideo.outputPath, data.projectId)

      // Upload to S3
      const [exportUrl, thumbnailUrl] = await Promise.all([
        uploadToS3(processedVideo.outputPath, `exports/${outputFilename}`),
        uploadToS3(thumbnailPath, `thumbnails/${data.projectId}-export.jpg`),
      ])

      // Update project with export data
      await prisma.project.update({
        where: { id: data.projectId },
        data: {
          status: 'COMPLETED',
          progress: 100,
          exportUrl,
          thumbnailUrl,
        },
      })

      // Clean up temp files
      this.cleanupTempFiles([inputPath, processedVideo.outputPath, thumbnailPath])

      return {
        success: true,
        exportUrl,
        thumbnailUrl,
        duration: processedVideo.duration,
        fileSize: processedVideo.fileSize,
      }
    } catch (error) {
      console.error('Export processing error:', error)
      
      // Update project with error status
      await prisma.project.update({
        where: { id: data.projectId },
        data: {
          status: 'FAILED',
          progress: 0,
        },
      })

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private async downloadPreview(previewUrl: string): Promise<string> {
    // In a real implementation, you'd download the file from S3
    // For now, assume it's already available locally
    return previewUrl
  }

  private async processVideo(options: {
    inputPath: string
    outputPath: string
    quality: '1080p' | '4K'
    removeWatermark: boolean
    projectId: string
  }): Promise<{ outputPath: string; duration: number; fileSize: number }> {
    const { inputPath, outputPath, quality, removeWatermark, projectId } = options

    return new Promise((resolve, reject) => {
      let ffmpegCommand = ffmpeg(inputPath)
        .outputOptions([
          '-c:v libx264',
          '-c:a aac',
          '-b:a 128k',
          '-movflags +faststart',
        ])

      // Set quality-specific options
      if (quality === '4K') {
        ffmpegCommand = ffmpegCommand
          .size('3840x2160')
          .videoBitrate('15000k')
      } else {
        ffmpegCommand = ffmpegCommand
          .size('1920x1080')
          .videoBitrate('8000k')
      }

      // Remove watermark if requested (and user has paid)
      if (removeWatermark) {
        // Add watermark removal filter
        // This is a simplified example - real implementation would be more complex
        ffmpegCommand = ffmpegCommand.videoFilters([
          'scale=1920:1080:flags=lanczos',
        ])
      } else {
        // Add ClipForge watermark
        const watermarkPath = path.join(process.cwd(), 'public', 'watermark.png')
        if (fs.existsSync(watermarkPath)) {
          ffmpegCommand = ffmpegCommand.videoFilters([
            `movie=${watermarkPath}[watermark]`,
            '[in][watermark]overlay=W-w-20:H-h-20[out]',
          ])
        }
      }

      // Progress tracking
      ffmpegCommand.on('progress', async (progress) => {
        const percent = Math.round(progress.percent || 0)
        await prisma.project.update({
          where: { id: projectId },
          data: { progress: Math.min(10 + (percent * 0.8), 90) },
        })
      })

      ffmpegCommand
        .save(outputPath)
        .on('end', () => {
          // Get file stats
          const stats = fs.statSync(outputPath)
          
          // Get video duration (simplified - would use ffprobe in real implementation)
          ffmpeg.ffprobe(outputPath, (err, metadata) => {
            const duration = metadata?.format?.duration || 0
            
            resolve({
              outputPath,
              duration,
              fileSize: stats.size,
            })
          })
        })
        .on('error', (error) => {
          console.error('FFmpeg error:', error)
          reject(error)
        })
    })
  }

  private async generateThumbnail(videoPath: string, projectId: string): Promise<string> {
    const thumbnailPath = path.join(this.tempDir, `${projectId}-thumbnail.jpg`)

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['50%'],
          filename: path.basename(thumbnailPath),
          folder: path.dirname(thumbnailPath),
          size: '1920x1080',
        })
        .on('end', () => resolve(thumbnailPath))
        .on('error', reject)
    })
  }

  private cleanupTempFiles(filePaths: string[]) {
    filePaths.forEach((filePath) => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      } catch (error) {
        console.error(`Failed to cleanup temp file ${filePath}:`, error)
      }
    })
  }
}

// Worker processor function
export async function processExportJob(data: ExportJobData): Promise<ExportJobResult> {
  const worker = new ExportWorker()
  return await worker.processExport(data)
}

// Utility function to add export job to queue
export async function addExportJob(
  projectId: string,
  userId: string,
  options: {
    quality?: '1080p' | '4K'
    removeWatermark?: boolean
    format?: 'mp4' | 'mov'
  } = {}
) {
  const jobData: ExportJobData = {
    projectId,
    userId,
    quality: options.quality || '1080p',
    removeWatermark: options.removeWatermark || false,
    format: options.format || 'mp4',
  }

  const job = await exportQueue.add('export', jobData, {
    priority: options.quality === '4K' ? 5 : 10, // 4K gets lower priority
    delay: 0,
  })

  return job
}

// Check if user can export without watermark
export async function canRemoveWatermark(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      credits: true,
      subscriptionStatus: true,
    },
  })

  if (!user) return false

  // User needs active subscription or credits
  return (
    user.subscriptionStatus === 'active' ||
    user.credits > 0
  )
}

// Deduct credits for export
export async function deductExportCredits(userId: string, quality: '1080p' | '4K'): Promise<boolean> {
  const creditsRequired = quality === '4K' ? 2 : 1
  
  try {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { credits: true, subscriptionStatus: true },
      })

      if (!user) throw new Error('User not found')

      // Skip credit deduction if user has active subscription
      if (user.subscriptionStatus === 'active') {
        return true
      }

      // Check if user has enough credits
      if (user.credits < creditsRequired) {
        throw new Error('Insufficient credits')
      }

      // Deduct credits
      await tx.user.update({
        where: { id: userId },
        data: { credits: { decrement: creditsRequired } },
      })

      // Log credit usage
      await tx.creditLedger.create({
        data: {
          userId,
          amount: -creditsRequired,
          type: 'EXPORT',
          description: `Export ${quality} video`,
        },
      })

      return true
    })

    return result
  } catch (error) {
    console.error('Failed to deduct export credits:', error)
    return false
  }
}