import { Worker, Job } from 'bullmq'
import { Redis } from 'ioredis'
import { prisma } from '@clipforge/database'
import fs from 'fs/promises'
import path from 'path'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
})

interface TTSJobData {
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
  voiceSettings: {
    voiceId?: string
    speed?: number
    pitch?: number
    provider?: 'elevenlabs' | 'azure' | 'google'
  }
  template: any
  quality: string
  watermark: boolean
}

interface TTSProvider {
  generateSpeech(text: string, settings: any): Promise<{ audioBuffer: Buffer; duration: number; phonemes?: any[] }>
}

class ElevenLabsTTSProvider implements TTSProvider {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY || ''
    if (!this.apiKey) {
      console.warn('ElevenLabs API key not configured')
    }
  }

  async generateSpeech(text: string, settings: any): Promise<{ audioBuffer: Buffer; duration: number; phonemes?: any[] }> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured')
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${settings.voiceId || 'pNInz6obpgDQGcFmaJgB'}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.0,
            use_speaker_boost: true,
            speaking_rate: settings.speed || 1.0,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`)
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer())
      
      // Estimate duration based on text length (rough approximation)
      const estimatedDuration = Math.max(2, text.split(' ').length * 0.5)
      
      return {
        audioBuffer,
        duration: estimatedDuration,
        phonemes: [], // ElevenLabs doesn't provide phoneme data in basic plan
      }
    } catch (error) {
      console.error('ElevenLabs TTS error:', error)
      throw error
    }
  }
}

class AzureTTSProvider implements TTSProvider {
  private apiKey: string
  private region: string

  constructor() {
    this.apiKey = process.env.AZURE_SPEECH_API_KEY || ''
    this.region = process.env.AZURE_SPEECH_REGION || 'eastus'
    if (!this.apiKey) {
      console.warn('Azure Speech API key not configured')
    }
  }

  async generateSpeech(text: string, settings: any): Promise<{ audioBuffer: Buffer; duration: number; phonemes?: any[] }> {
    if (!this.apiKey) {
      throw new Error('Azure Speech API key not configured')
    }

    try {
      // Build SSML with voice settings
      const ssml = `
        <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
          <voice name="${settings.voiceId || 'en-US-AriaNeural'}">
            <prosody rate="${settings.speed || 1.0}" pitch="${settings.pitch || 0}st">
              ${text}
            </prosody>
          </voice>
        </speak>
      `.trim()

      const response = await fetch(`https://${this.region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.apiKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        },
        body: ssml,
      })

      if (!response.ok) {
        throw new Error(`Azure Speech API error: ${response.status}`)
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer())
      
      // Estimate duration
      const estimatedDuration = Math.max(2, text.split(' ').length * 0.5)
      
      return {
        audioBuffer,
        duration: estimatedDuration,
        phonemes: [], // Would need additional API call for phoneme data
      }
    } catch (error) {
      console.error('Azure TTS error:', error)
      throw error
    }
  }
}

// Fallback mock provider for development
class MockTTSProvider implements TTSProvider {
  async generateSpeech(text: string, settings: any): Promise<{ audioBuffer: Buffer; duration: number; phonemes?: any[] }> {
    // Generate a silent audio buffer for testing
    const duration = Math.max(2, text.split(' ').length * 0.5)
    const sampleRate = 16000
    const samples = Math.floor(duration * sampleRate)
    const audioBuffer = Buffer.alloc(samples * 2) // 16-bit audio
    
    return {
      audioBuffer,
      duration,
      phonemes: [],
    }
  }
}

function getTTSProvider(provider: string): TTSProvider {
  switch (provider) {
    case 'elevenlabs':
      return new ElevenLabsTTSProvider()
    case 'azure':
      return new AzureTTSProvider()
    default:
      return new MockTTSProvider()
  }
}

const ttsGenerationWorker = new Worker(
  'tts-generation',
  async (job: Job<TTSJobData>) => {
    const { projectId, userId, processedScenes, voiceSettings, template } = job.data
    
    try {
      // Update project progress
      await prisma.project.update({
        where: { id: projectId },
        data: { progress: 20 },
      })

      job.updateProgress(10)

      const provider = getTTSProvider(voiceSettings.provider || 'mock')
      const audioSegments: Array<{
        sceneId: string
        audioPath: string
        duration: number
        startTime: number
        endTime: number
        phonemes: any[]
      }> = []

      // Create temp directory for audio files
      const tempDir = path.join(process.cwd(), 'temp', projectId)
      await fs.mkdir(tempDir, { recursive: true })

      // Process each scene
      for (let i = 0; i < processedScenes.length; i++) {
        const scene = processedScenes[i]
        
        try {
          console.log(`Generating TTS for scene ${scene.sceneId}: ${scene.text.substring(0, 50)}...`)

          // Generate speech for this scene
          const { audioBuffer, duration, phonemes } = await provider.generateSpeech(scene.text, voiceSettings)

          // Save audio file
          const audioFilename = `${scene.sceneId}.mp3`
          const audioPath = path.join(tempDir, audioFilename)
          await fs.writeFile(audioPath, audioBuffer)

          audioSegments.push({
            sceneId: scene.sceneId,
            audioPath,
            duration,
            startTime: scene.startTime,
            endTime: scene.endTime,
            phonemes: phonemes || [],
          })

          // Update progress
          const progressPercent = 10 + Math.floor((i + 1) / processedScenes.length * 60)
          job.updateProgress(progressPercent)

        } catch (error) {
          console.error(`TTS generation failed for scene ${scene.sceneId}:`, error)
          throw new Error(`TTS failed for scene ${scene.sceneId}: ${error}`)
        }
      }

      job.updateProgress(80)

      // Create timing map
      const timingMap = {
        totalDuration: audioSegments.reduce((sum, seg) => sum + seg.duration, 0),
        segments: audioSegments.map(seg => ({
          sceneId: seg.sceneId,
          startTime: seg.startTime,
          endTime: seg.endTime,
          duration: seg.duration,
          audioFile: path.basename(seg.audioPath),
        })),
      }

      // Update project with audio data
      await prisma.project.update({
        where: { id: projectId },
        data: { 
          progress: 90,
          // Store audio metadata in project
          script: JSON.stringify({
            scenes: processedScenes,
            audioSegments,
            timingMap,
          }),
        },
      })

      job.updateProgress(95)

      // Trigger next stage - Asset Selection
      const { Queue } = await import('bullmq')
      const assetJobQueue = new Queue('asset-selection', { connection: redis })
      
      await assetJobQueue.add(`assets-${projectId}`, {
        ...job.data,
        audioSegments,
        timingMap,
      })

      job.updateProgress(100)

      return { success: true, audioSegments, timingMap }
    } catch (error) {
      console.error('TTS generation failed:', error)
      
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'FAILED', progress: 0 },
      })
      
      throw error
    }
  },
  {
    connection: redis,
    concurrency: 2,
  }
)

ttsGenerationWorker.on('completed', (job) => {
  console.log(`TTS generation completed for job ${job.id}`)
})

ttsGenerationWorker.on('failed', (job, err) => {
  console.error(`TTS generation failed for job ${job?.id}:`, err)
})

export default ttsGenerationWorker