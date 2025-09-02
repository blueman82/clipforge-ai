import { Worker, Job } from 'bullmq'
import { Redis } from 'ioredis'
import { prisma } from '@clipforge/database'
import { ScriptGenerationService } from './services/script-generation'
import { TTSService } from './services/tts'
import { VideoCompositionService } from './services/video-composition'
import { AssetService } from './services/asset-service'
import cron from 'node-cron'

// Redis connection
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryDelayOnFailedAttempt: (attempt) => Math.min(attempt * 100, 3000),
})

// Job processors
const scriptGenerationService = new ScriptGenerationService()
const ttsService = new TTSService()
const videoCompositionService = new VideoCompositionService()
const assetService = new AssetService()

// Script Generation Worker
const scriptWorker = new Worker('script-generation', async (job: Job) => {
  console.log(`Processing script generation job ${job.id}`)
  
  try {
    const { projectId, prompt, niche, template } = job.data
    
    // Update project status
    await prisma.project.update({
      where: { id: projectId },
      data: { 
        status: 'PROCESSING',
        progress: 10,
      },
    })

    // Generate script
    const script = await scriptGenerationService.generateScript({
      prompt,
      niche,
      template,
    })

    // Update project with script
    await prisma.project.update({
      where: { id: projectId },
      data: { 
        script: JSON.stringify(script),
        progress: 25,
      },
    })

    // Queue TTS job
    await job.queue.add('tts-generation', {
      projectId,
      script,
    }, {
      delay: 1000, // Small delay between steps
    })

    console.log(`Script generation completed for project ${projectId}`)
    return { success: true, script }
  } catch (error) {
    console.error(`Script generation failed for job ${job.id}:`, error)
    
    // Update project status to failed
    await prisma.project.update({
      where: { id: job.data.projectId },
      data: { 
        status: 'FAILED',
        progress: 0,
      },
    })
    
    throw error
  }
}, { connection: redis })

// TTS Worker
const ttsWorker = new Worker('tts-generation', async (job: Job) => {
  console.log(`Processing TTS generation job ${job.id}`)
  
  try {
    const { projectId, script } = job.data
    
    // Update progress
    await prisma.project.update({
      where: { id: projectId },
      data: { progress: 40 },
    })

    // Generate TTS audio
    const audioData = await ttsService.generateAudio(script)

    // Update progress
    await prisma.project.update({
      where: { id: projectId },
      data: { progress: 60 },
    })

    // Queue asset selection
    await job.queue.add('asset-selection', {
      projectId,
      script,
      audioData,
    })

    console.log(`TTS generation completed for project ${projectId}`)
    return { success: true, audioData }
  } catch (error) {
    console.error(`TTS generation failed for job ${job.id}:`, error)
    
    await prisma.project.update({
      where: { id: job.data.projectId },
      data: { status: 'FAILED' },
    })
    
    throw error
  }
}, { connection: redis })

// Asset Selection Worker
const assetWorker = new Worker('asset-selection', async (job: Job) => {
  console.log(`Processing asset selection job ${job.id}`)
  
  try {
    const { projectId, script, audioData } = job.data
    
    // Update progress
    await prisma.project.update({
      where: { id: projectId },
      data: { progress: 70 },
    })

    // Select assets for each scene
    const assets = await assetService.selectAssets(script)

    // Queue video composition
    await job.queue.add('video-composition', {
      projectId,
      script,
      audioData,
      assets,
    })

    console.log(`Asset selection completed for project ${projectId}`)
    return { success: true, assets }
  } catch (error) {
    console.error(`Asset selection failed for job ${job.id}:`, error)
    
    await prisma.project.update({
      where: { id: job.data.projectId },
      data: { status: 'FAILED' },
    })
    
    throw error
  }
}, { connection: redis })

// Video Composition Worker
const compositionWorker = new Worker('video-composition', async (job: Job) => {
  console.log(`Processing video composition job ${job.id}`)
  
  try {
    const { projectId, script, audioData, assets } = job.data
    
    // Update progress
    await prisma.project.update({
      where: { id: projectId },
      data: { progress: 85 },
    })

    // Compose video with watermark (preview)
    const previewVideo = await videoCompositionService.composeVideo(
      script,
      assets,
      audioData,
      {
        resolution: '720x1280',
        quality: 'low',
      }
    )

    // Update project with preview URL
    await prisma.project.update({
      where: { id: projectId },
      data: { 
        previewUrl: previewVideo.outputPath,
        status: 'COMPLETED',
        progress: 100,
      },
    })

    console.log(`Video composition completed for project ${projectId}`)
    return { success: true, previewUrl: previewVideo.outputPath }
  } catch (error) {
    console.error(`Video composition failed for job ${job.id}:`, error)
    
    await prisma.project.update({
      where: { id: job.data.projectId },
      data: { status: 'FAILED' },
    })
    
    throw error
  }
}, { connection: redis })

// Export Worker (for paid users)
const exportWorker = new Worker('video-export', async (job: Job) => {
  console.log(`Processing video export job ${job.id}`)
  
  try {
    const { projectId, quality = '1080p' } = job.data
    
    // Get project data
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true },
    })

    if (!project) throw new Error('Project not found')

    // Check if user has credits
    if (project.user.credits < 1) {
      throw new Error('Insufficient credits')
    }

    // Parse script and regenerate video without watermark
    const script = JSON.parse(project.script || '{}')
    const exportVideo = await videoCompositionService.composeVideo({
      script,
      audioData: null, // Would need to regenerate or store
      assets: null, // Would need to regenerate or store
      watermark: false,
      quality,
    })

    // Deduct credit and update project
    await prisma.$transaction([
      prisma.user.update({
        where: { id: project.userId },
        data: { credits: { decrement: 1 } },
      }),
      prisma.creditLedger.create({
        data: {
          userId: project.userId,
          amount: -1,
          type: 'EXPORT',
          description: 'Video export',
          reference: projectId,
        },
      }),
      prisma.project.update({
        where: { id: projectId },
        data: { exportUrl: exportVideo.url },
      }),
    ])

    console.log(`Video export completed for project ${projectId}`)
    return { success: true, exportUrl: exportVideo.url }
  } catch (error) {
    console.error(`Video export failed for job ${job.id}:`, error)
    throw error
  }
}, { connection: redis })

// Cleanup job - runs daily at 2 AM
cron.schedule('0 2 * * *', async () => {
  console.log('Running daily cleanup job...')
  try {
    // Clean up temporary files older than 24 hours
    await videoCompositionService.cleanupTempFiles()
    
    // Clean up failed jobs older than 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    await prisma.project.deleteMany({
      where: {
        status: 'FAILED',
        createdAt: {
          lt: sevenDaysAgo,
        },
      },
    })
    
    console.log('Daily cleanup completed')
  } catch (error) {
    console.error('Daily cleanup failed:', error)
  }
})

// Health check endpoint for monitoring
process.on('SIGTERM', async () => {
  console.log('Shutting down worker processes...')
  await scriptWorker.close()
  await ttsWorker.close()
  await assetWorker.close()
  await compositionWorker.close()
  await exportWorker.close()
  await redis.disconnect()
  await prisma.$disconnect()
  process.exit(0)
})

console.log('🎬 ClipForge AI Worker started')
console.log('Listening for jobs on queues: script-generation, tts-generation, asset-selection, video-composition, video-export')