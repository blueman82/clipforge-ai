import fs from 'fs-extra'
import path from 'path'
import { v4 as uuid } from 'uuid'
import axios from 'axios'
import type { Script } from './script-generation'

export interface AudioData {
  segments: Array<{
    sceneId: string
    audioUrl: string
    duration: number
    timings: {
      start: number
      end: number
    }
  }>
  totalDuration: number
  tempFiles: string[]
}

export class TTSService {
  private tempDir = path.join(process.cwd(), 'temp', 'audio')

  constructor() {
    // Ensure temp directory exists
    fs.ensureDirSync(this.tempDir)
  }

  async generateAudio(script: Script): Promise<AudioData> {
    const audioData: AudioData = {
      segments: [],
      totalDuration: 0,
      tempFiles: [],
    }

    try {
      // Process each scene
      for (const scene of script.scenes) {
        const audioSegment = await this.generateSceneAudio(scene.id, scene.text)
        
        audioData.segments.push({
          sceneId: scene.id,
          audioUrl: audioSegment.url,
          duration: audioSegment.duration,
          timings: scene.timestamp,
        })
        
        audioData.tempFiles.push(audioSegment.filePath)
      }

      audioData.totalDuration = script.totalDuration
      return audioData
    } catch (error) {
      // Clean up any created files on error
      await this.cleanupFiles(audioData.tempFiles)
      throw error
    }
  }

  private async generateSceneAudio(sceneId: string, text: string) {
    // For demo purposes, using a mock TTS service
    // In production, integrate with ElevenLabs, Azure Speech, or similar
    
    const fileName = `${sceneId}-${uuid()}.wav`
    const filePath = path.join(this.tempDir, fileName)
    
    try {
      // Mock TTS generation - replace with actual TTS service
      const mockAudioData = await this.mockTTSGeneration(text)
      
      // Save audio file
      await fs.writeFile(filePath, mockAudioData)
      
      // Calculate duration (mock - in production, get from actual audio)
      const duration = Math.max(2, Math.min(8, text.length / 20)) // Rough estimate
      
      return {
        url: filePath,
        filePath,
        duration,
      }
    } catch (error) {
      console.error(`TTS generation failed for scene ${sceneId}:`, error)
      throw error
    }
  }

  private async mockTTSGeneration(text: string): Promise<Buffer> {
    // Mock implementation - generates silent audio data
    // In production, this would call an actual TTS API
    
    if (process.env.ELEVENLABS_API_KEY) {
      // Example ElevenLabs integration
      return await this.generateWithElevenLabs(text)
    }
    
    if (process.env.AZURE_SPEECH_KEY) {
      // Example Azure Speech integration
      return await this.generateWithAzureSpeech(text)
    }
    
    // Fallback: generate silent audio buffer for demo
    const duration = Math.max(2, Math.min(8, text.length / 20))
    const sampleRate = 44100
    const samples = Math.floor(duration * sampleRate)
    const buffer = Buffer.alloc(samples * 2) // 16-bit audio
    
    return buffer
  }

  private async generateWithElevenLabs(text: string): Promise<Buffer> {
    try {
      const response = await axios.post(
        'https://api.elevenlabs.io/v1/text-to-speech/VOICE_ID',
        {
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
          },
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': process.env.ELEVENLABS_API_KEY,
          },
          responseType: 'arraybuffer',
        }
      )
      
      return Buffer.from(response.data)
    } catch (error) {
      console.error('ElevenLabs TTS failed:', error)
      throw error
    }
  }

  private async generateWithAzureSpeech(text: string): Promise<Buffer> {
    try {
      // Azure Speech Service implementation
      const response = await axios.post(
        `https://${process.env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
        `<speak version='1.0' xml:lang='en-US'>
          <voice xml:lang='en-US' xml:gender='Neural' name='en-US-AriaNeural'>
            ${text}
          </voice>
        </speak>`,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
            'Content-Type': 'application/ssml+xml',
            'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
          },
          responseType: 'arraybuffer',
        }
      )
      
      return Buffer.from(response.data)
    } catch (error) {
      console.error('Azure Speech TTS failed:', error)
      throw error
    }
  }

  async cleanupFiles(filePaths: string[]): Promise<void> {
    await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          await fs.remove(filePath)
        } catch (error) {
          console.warn(`Failed to cleanup file ${filePath}:`, error)
        }
      })
    )
  }
}