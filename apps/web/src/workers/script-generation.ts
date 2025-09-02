import { Worker, Job } from 'bullmq'
import { Redis } from 'ioredis'
import { prisma } from '@clipforge/database'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
})

interface ScriptJobData {
  projectId: string
  userId: string
  script: string
  template: any
  voiceSettings: any
  quality: string
  watermark: boolean
}

const scriptGenerationWorker = new Worker(
  'script-generation',
  async (job: Job<ScriptJobData>) => {
    const { projectId, userId, script, template } = job.data
    
    try {
      await prisma.project.update({
        where: { id: projectId },
        data: { progress: 10 },
      })

      job.updateProgress(10)

      const scenes = processScriptToScenes(script)
      
      job.updateProgress(30)

      if (!validateTemplateCompatibility(template, scenes)) {
        throw new Error('Template not compatible with script structure')
      }

      job.updateProgress(50)

      const processedScenes = await generateSceneTiming(scenes, template)
      
      job.updateProgress(70)

      await prisma.project.update({
        where: { id: projectId },
        data: { 
          progress: 80,
          script: JSON.stringify(processedScenes),
        },
      })

      job.updateProgress(90)

      const { Queue } = await import('bullmq')
      const ttsJobQueue = new Queue('tts-generation', { connection: redis })
      
      await ttsJobQueue.add(`tts-${projectId}`, {
        ...job.data,
        processedScenes,
      })

      job.updateProgress(100)

      return { success: true, processedScenes }
    } catch (error) {
      console.error('Script generation failed:', error)
      
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'FAILED', progress: 0 },
      })
      
      throw error
    }
  },
  {
    connection: redis,
    concurrency: 3,
  }
)

function processScriptToScenes(script: string): Array<{ text: string; duration: number; type: string }> {
  const sentences = script.split(/[.!?]+/).filter(s => s.trim().length > 0)
  
  return sentences.map((sentence, index) => ({
    text: sentence.trim(),
    duration: Math.max(2, sentence.trim().split(' ').length * 0.5),
    type: index === 0 ? 'intro' : index === sentences.length - 1 ? 'outro' : 'main',
    sceneId: `scene-${index + 1}`,
  }))
}

function validateTemplateCompatibility(template: any, scenes: any[]): boolean {
  if (!template.maxScenes || scenes.length > template.maxScenes) {
    return false
  }
  
  const requiredTypes = Array.from(new Set(scenes.map(s => s.type)))
  const supportedTypes = template.supportedSceneTypes || ['intro', 'main', 'outro']
  
  return requiredTypes.every(type => supportedTypes.includes(type))
}

async function generateSceneTiming(scenes: any[], template: any): Promise<any[]> {
  let currentTime = 0
  
  return scenes.map((scene, index) => {
    const result = {
      ...scene,
      startTime: currentTime,
      endTime: currentTime + scene.duration,
      templateLayer: template.sceneLayers?.[scene.type] || 'default',
      transitions: {
        in: index === 0 ? template.transitions?.intro : template.transitions?.standard,
        out: index === scenes.length - 1 ? template.transitions?.outro : template.transitions?.standard,
      },
    }
    currentTime = result.endTime
    return result
  })
}

scriptGenerationWorker.on('completed', (job) => {
  console.log(`Script generation completed for job ${job.id}`)
})

scriptGenerationWorker.on('failed', (job, err) => {
  console.error(`Script generation failed for job ${job?.id}:`, err)
})

export default scriptGenerationWorker