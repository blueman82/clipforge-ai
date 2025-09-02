import { Worker, Job } from 'bullmq'
import { Redis } from 'ioredis'
import { prisma } from '@clipforge/database'
import fs from 'fs/promises'
import path from 'path'
import { spawn } from 'child_process'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
})

interface CompositionJobData {
  projectId: string
  userId: string
  processedScenes: Array<{
    text: string
    duration: number
    type: string
    sceneId: string
    startTime: number
    endTime: number
    templateLayer: string
    transitions: any
  }>
  audioSegments: Array<{
    sceneId: string
    audioPath: string
    duration: number
    startTime: number
    endTime: number
    phonemes: any[]
  }>
  selectedAssets: Array<{
    sceneId: string
    assetType: 'video' | 'image'
    asset: any
    localPath?: string
    startTime: number
    endTime: number
    duration: number
  }>
  timingMap: any
  template: any
  quality: string
  watermark: boolean
}

interface FFmpegComposer {
  composeVideo(data: CompositionJobData): Promise<{ outputPath: string; duration: number; resolution: { width: number; height: number } }>
}

class StandardFFmpegComposer implements FFmpegComposer {
  private ffmpegPath: string

  constructor() {
    this.ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg'
  }

  async composeVideo(data: CompositionJobData): Promise<{ outputPath: string; duration: number; resolution: { width: number; height: number } }> {
    const { projectId, selectedAssets, audioSegments, template, quality, watermark } = data

    // Create output directory
    const outputDir = path.join(process.cwd(), 'temp', projectId, 'output')
    await fs.mkdir(outputDir, { recursive: true })

    // Determine output settings based on quality
    const qualitySettings = this.getQualitySettings(quality)
    const outputPath = path.join(outputDir, `composed-${Date.now()}.mp4`)

    // Build FFmpeg command
    const ffmpegArgs = this.buildFFmpegCommand({
      selectedAssets,
      audioSegments,
      template,
      qualitySettings,
      watermark,
      outputPath,
    })

    console.log('Running FFmpeg with args:', ffmpegArgs.join(' '))

    // Execute FFmpeg
    await this.runFFmpeg(ffmpegArgs)

    // Get output video info
    const { duration, resolution } = await this.getVideoInfo(outputPath)

    return {
      outputPath,
      duration,
      resolution,
    }
  }

  private getQualitySettings(quality: string) {
    const settings = {
      '540p': {
        width: 960,
        height: 540,
        bitrate: '2500k',
        preset: 'medium',
        crf: 23,
      },
      '1080p': {
        width: 1920,
        height: 1080,
        bitrate: '5000k',
        preset: 'medium',
        crf: 20,
      },
      '4k': {
        width: 3840,
        height: 2160,
        bitrate: '15000k',
        preset: 'slow',
        crf: 18,
      },
    }

    return settings[quality as keyof typeof settings] || settings['1080p']
  }

  private buildFFmpegCommand(options: {
    selectedAssets: any[]
    audioSegments: any[]
    template: any
    qualitySettings: any
    watermark: boolean
    outputPath: string
  }): string[] {
    const { selectedAssets, audioSegments, template, qualitySettings, watermark, outputPath } = options
    
    const args: string[] = ['-y'] // Overwrite output file

    // Input files - add all assets and audio files
    const inputFiles: string[] = []
    
    // Add video/image assets
    selectedAssets.forEach((asset, index) => {
      if (asset.localPath && asset.localPath !== '') {
        args.push('-i', asset.localPath)
        inputFiles.push(`asset_${index}`)
      }
    })

    // Add audio segments
    audioSegments.forEach((audio, index) => {
      if (audio.audioPath) {
        args.push('-i', audio.audioPath)
        inputFiles.push(`audio_${index}`)
      }
    })

    // Filter complex for video composition
    let filterComplex = ''
    let videoInputs = ''
    let audioInputs = ''

    // Process each asset
    selectedAssets.forEach((asset, index) => {
      if (!asset.localPath) return

      const scaleFilter = asset.assetType === 'image' 
        ? `[${index}:v]scale=${qualitySettings.width}:${qualitySettings.height}:force_original_aspect_ratio=decrease,pad=${qualitySettings.width}:${qualitySettings.height}:(ow-iw)/2:(oh-ih)/2,setpts=PTS-STARTPTS,fps=30,loop=loop=-1:size=1:start=0[v${index}];`
        : `[${index}:v]scale=${qualitySettings.width}:${qualitySettings.height}:force_original_aspect_ratio=decrease,pad=${qualitySettings.width}:${qualitySettings.height}:(ow-iw)/2:(oh-ih)/2,setpts=PTS-STARTPTS[v${index}];`

      filterComplex += scaleFilter

      // Add timing for video segments
      const startTime = asset.startTime || 0
      const duration = asset.duration || 5

      if (asset.assetType === 'video') {
        filterComplex += `[v${index}]trim=start=0:duration=${duration},setpts=PTS-STARTPTS[v${index}_trimmed];`
        videoInputs += `[v${index}_trimmed]`
      } else {
        videoInputs += `[v${index}]`
      }
    })

    // Concatenate video segments
    if (selectedAssets.length > 0) {
      const videoCount = selectedAssets.filter(a => a.localPath).length
      if (videoCount > 1) {
        filterComplex += `${videoInputs}concat=n=${videoCount}:v=1:a=0[video];`
      } else {
        filterComplex += `${videoInputs.replace(/[\[\]]/g, '')}copy[video];`
      }
    }

    // Process audio segments
    audioSegments.forEach((audio, index) => {
      const audioIndex = selectedAssets.filter(a => a.localPath).length + index
      audioInputs += `[${audioIndex}:a]`
    })

    // Concatenate audio segments
    if (audioSegments.length > 0) {
      if (audioSegments.length > 1) {
        filterComplex += `${audioInputs}concat=n=${audioSegments.length}:v=0:a=1[audio];`
      } else {
        filterComplex += `${audioInputs.replace(/[\[\]]/g, '')}copy[audio];`
      }
    }

    // Add watermark if enabled
    if (watermark) {
      filterComplex += `[video]drawtext=text='ClipForge AI':x=10:y=10:fontsize=24:fontcolor=white@0.8:box=1:boxcolor=black@0.5[video_watermarked];`
      args.push('-map', '[video_watermarked]')
    } else {
      args.push('-map', '[video]')
    }

    // Map audio
    if (audioSegments.length > 0) {
      args.push('-map', '[audio]')
    }

    // Add filter complex
    if (filterComplex) {
      args.push('-filter_complex', filterComplex)
    }

    // Video codec settings
    args.push(
      '-c:v', 'libx264',
      '-preset', qualitySettings.preset,
      '-crf', qualitySettings.crf.toString(),
      '-maxrate', qualitySettings.bitrate,
      '-bufsize', (parseInt(qualitySettings.bitrate) * 2).toString() + 'k',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart'
    )

    // Audio codec settings
    if (audioSegments.length > 0) {
      args.push(
        '-c:a', 'aac',
        '-b:a', '128k',
        '-ar', '44100'
      )
    }

    // Output file
    args.push(outputPath)

    return [this.ffmpegPath, ...args]
  }

  private async runFFmpeg(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const process = spawn(args[0], args.slice(1), {
        stdio: ['ignore', 'pipe', 'pipe']
      })

      let stdout = ''
      let stderr = ''

      process.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      process.stderr.on('data', (data) => {
        stderr += data.toString()
        console.log('FFmpeg:', data.toString().trim())
      })

      process.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          console.error('FFmpeg failed:', stderr)
          reject(new Error(`FFmpeg failed with code ${code}: ${stderr}`))
        }
      })

      process.on('error', (error) => {
        console.error('FFmpeg process error:', error)
        reject(error)
      })
    })
  }

  private async getVideoInfo(videoPath: string): Promise<{ duration: number; resolution: { width: number; height: number } }> {
    return new Promise((resolve, reject) => {
      const process = spawn('ffprobe', [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        videoPath
      ])

      let stdout = ''

      process.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      process.on('close', (code) => {
        if (code === 0) {
          try {
            const info = JSON.parse(stdout)
            const videoStream = info.streams.find((s: any) => s.codec_type === 'video')
            const duration = parseFloat(info.format.duration) || 0
            const resolution = {
              width: videoStream?.width || 1920,
              height: videoStream?.height || 1080,
            }
            resolve({ duration, resolution })
          } catch (error) {
            reject(error)
          }
        } else {
          reject(new Error(`ffprobe failed with code ${code}`))
        }
      })
    })
  }
}

// Mock composer for development
class MockFFmpegComposer implements FFmpegComposer {
  async composeVideo(data: CompositionJobData): Promise<{ outputPath: string; duration: number; resolution: { width: number; height: number } }> {
    const { projectId, quality } = data
    
    // Create mock output file
    const outputDir = path.join(process.cwd(), 'temp', projectId, 'output')
    await fs.mkdir(outputDir, { recursive: true })
    
    const outputPath = path.join(outputDir, `mock-composed-${Date.now()}.mp4`)
    await fs.writeFile(outputPath, Buffer.from('Mock video file'))
    
    // Calculate mock duration based on scenes
    const totalDuration = data.audioSegments.reduce((sum, seg) => sum + seg.duration, 0) || 30
    
    // Return mock resolution based on quality
    const resolutions = {
      '540p': { width: 960, height: 540 },
      '1080p': { width: 1920, height: 1080 },
      '4k': { width: 3840, height: 2160 },
    }
    
    return {
      outputPath,
      duration: totalDuration,
      resolution: resolutions[quality as keyof typeof resolutions] || resolutions['1080p'],
    }
  }
}

function getComposer(): FFmpegComposer {
  // Check if FFmpeg is available
  const useFFmpeg = process.env.USE_FFMPEG !== 'false' && process.env.NODE_ENV !== 'development'
  return useFFmpeg ? new StandardFFmpegComposer() : new MockFFmpegComposer()
}

const videoCompositionWorker = new Worker(
  'video-composition',
  async (job: Job<CompositionJobData>) => {
    const { projectId, userId } = job.data
    
    try {
      // Update project progress
      await prisma.project.update({
        where: { id: projectId },
        data: { progress: 40 },
      })

      job.updateProgress(10)

      console.log(`Starting video composition for project ${projectId}`)

      const composer = getComposer()
      
      // Validate input data
      if (!job.data.selectedAssets || job.data.selectedAssets.length === 0) {
        throw new Error('No assets provided for composition')
      }

      if (!job.data.audioSegments || job.data.audioSegments.length === 0) {
        throw new Error('No audio segments provided for composition')
      }

      job.updateProgress(20)

      // Compose video
      const { outputPath, duration, resolution } = await composer.composeVideo(job.data)

      job.updateProgress(80)

      // Update project with composition results
      await prisma.project.update({
        where: { id: projectId },
        data: { 
          progress: 90,
          previewUrl: outputPath,
          script: JSON.stringify({
            ...JSON.parse(await prisma.project.findUniqueOrThrow({ where: { id: projectId }, select: { script: true } }).then(p => p.script || '{}')),
            compositionResults: {
              outputPath,
              duration,
              resolution,
              quality: job.data.quality,
              watermark: job.data.watermark,
            },
          }),
        },
      })

      job.updateProgress(95)

      // Trigger next stage - Video Export
      const { Queue } = await import('bullmq')
      const exportJobQueue = new Queue('video-export', { connection: redis })
      
      await exportJobQueue.add(`export-${projectId}`, {
        ...job.data,
        composedVideoPath: outputPath,
        duration,
        resolution,
      })

      job.updateProgress(100)

      console.log(`Video composition completed for project ${projectId}`)

      return { 
        success: true, 
        outputPath, 
        duration, 
        resolution,
        previewUrl: outputPath,
      }
    } catch (error) {
      console.error('Video composition failed:', error)
      
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'FAILED', progress: 0 },
      })
      
      throw error
    }
  },
  {
    connection: redis,
    concurrency: 1, // Limit concurrency due to CPU/memory intensive operations
  }
)

videoCompositionWorker.on('completed', (job) => {
  console.log(`Video composition completed for job ${job.id}`)
})

videoCompositionWorker.on('failed', (job, err) => {
  console.error(`Video composition failed for job ${job?.id}:`, err)
})

export default videoCompositionWorker