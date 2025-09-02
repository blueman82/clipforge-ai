import fs from 'fs-extra'
import path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import { v4 as uuidv4 } from 'uuid'
import type { Script } from './script-generation'
import type { AssetData } from './asset-service'
import type { AudioData } from './tts'

export interface VideoCompositionData {
  outputPath: string
  tempFiles: string[]
  metadata: {
    duration: number
    resolution: string
    format: string
  }
}

export interface CompositionOptions {
  resolution?: '1080x1920' | '720x1280' | '1080x1080'
  format?: 'mp4' | 'mov'
  framerate?: number
  quality?: 'high' | 'medium' | 'low'
}

export class VideoCompositionService {
  private tempDir = path.join(process.cwd(), 'temp', 'composition')
  private outputDir = path.join(process.cwd(), 'output')

  constructor() {
    // Ensure directories exist
    fs.ensureDirSync(this.tempDir)
    fs.ensureDirSync(this.outputDir)
  }

  async composeVideo(
    script: Script,
    assetData: AssetData,
    audioData: AudioData,
    options: CompositionOptions = {}
  ): Promise<VideoCompositionData> {
    const {
      resolution = '1080x1920',
      format = 'mp4',
      framerate = 30,
      quality = 'medium',
    } = options

    const outputFilename = `video-${uuidv4()}.${format}`
    const outputPath = path.join(this.outputDir, outputFilename)
    const tempFiles: string[] = []

    try {
      // Step 1: Create video segments for each scene
      const videoSegments = await this.createVideoSegments(script, assetData, {
        resolution,
        framerate,
        quality,
      })
      tempFiles.push(...videoSegments)

      // Step 2: Concatenate video segments
      const videoWithoutAudio = await this.concatenateSegments(videoSegments)
      tempFiles.push(videoWithoutAudio)

      // Step 3: Concatenate audio segments and add to video
      const concatenatedAudio = await this.concatenateAudioSegments(audioData)
      tempFiles.push(concatenatedAudio)
      await this.addAudioTrack(videoWithoutAudio, concatenatedAudio, outputPath)

      // Step 4: Get video metadata
      const metadata = await this.getVideoMetadata(outputPath)

      return {
        outputPath,
        tempFiles,
        metadata,
      }
    } catch (error) {
      // Cleanup on error
      await this.cleanupFiles(tempFiles)
      throw error
    }
  }

  private async createVideoSegments(
    script: Script,
    assetData: AssetData,
    options: { resolution: string; framerate: number; quality: string }
  ): Promise<string[]> {
    const segments: string[] = []

    for (const scene of script.scenes) {
      const sceneAssets = assetData.scenes.find(s => s.sceneId === scene.id)
      if (!sceneAssets) {
        throw new Error(`No assets found for scene ${scene.id}`)
      }

      const segmentPath = await this.createSceneSegment(scene, sceneAssets.assets, options)
      segments.push(segmentPath)
    }

    return segments
  }

  private async createSceneSegment(
    scene: any,
    assets: any[],
    options: { resolution: string; framerate: number; quality: string }
  ): Promise<string> {
    const segmentFilename = `segment-${scene.id}.mp4`
    const segmentPath = path.join(this.tempDir, segmentFilename)
    const [width, height] = options.resolution.split('x').map(Number)

    return new Promise((resolve, reject) => {
      let command = ffmpeg()

      if (assets.length === 1) {
        // Single asset for the scene
        const asset = assets[0]
        command = command.input(asset.localPath)

        if (asset.type === 'image') {
          // For images, create a video with the specified duration
          command = command
            .inputOptions([
              '-loop 1',
              '-t', scene.duration.toString(),
            ])
        } else if (asset.type === 'video') {
          // For videos, trim or loop to match scene duration
          command = command
            .inputOptions([
              '-ss 0',
              '-t', scene.duration.toString(),
            ])
        }
      } else {
        // Multiple assets - create a slideshow or montage
        assets.forEach((asset, index) => {
          command = command.input(asset.localPath)
          
          if (asset.type === 'image') {
            command = command.inputOptions([
              '-loop 1',
              '-t', (scene.duration / assets.length).toString(),
            ])
          }
        })

        // Create filter for transitioning between assets
        const filterComplex = this.createTransitionFilter(assets, scene.duration, width, height)
        command = command.complexFilter(filterComplex)
      }

      // Apply video settings
      command = command
        .videoCodec('libx264')
        .size(`${width}x${height}`)
        .fps(options.framerate)
        .outputOptions([
          '-pix_fmt yuv420p',
          '-preset fast',
          options.quality === 'high' ? '-crf 18' : 
          options.quality === 'medium' ? '-crf 23' : '-crf 28',
        ])
        .output(segmentPath)
        .on('end', () => resolve(segmentPath))
        .on('error', (error) => {
          console.error(`Error creating segment for scene ${scene.id}:`, error)
          reject(error)
        })

      command.run()
    })
  }

  private createTransitionFilter(
    assets: any[],
    totalDuration: number,
    width: number,
    height: number
  ): string {
    if (assets.length === 1) {
      return `[0:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1[v]`
    }

    // Create a crossfade transition between assets
    const segmentDuration = totalDuration / assets.length
    const transitionDuration = Math.min(0.5, segmentDuration * 0.1) // 0.5s max transition

    let filterComplex = ''
    
    // Scale all inputs
    for (let i = 0; i < assets.length; i++) {
      filterComplex += `[${i}:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1[v${i}];`
    }

    // Create crossfade transitions
    if (assets.length === 2) {
      filterComplex += `[v0][v1]xfade=transition=fade:duration=${transitionDuration}:offset=${segmentDuration - transitionDuration}[v]`
    } else {
      // For more than 2 assets, chain xfade filters
      filterComplex += `[v0][v1]xfade=transition=fade:duration=${transitionDuration}:offset=${segmentDuration - transitionDuration}[x1];`
      
      for (let i = 2; i < assets.length; i++) {
        const offset = (segmentDuration * i) - transitionDuration
        if (i === assets.length - 1) {
          filterComplex += `[x${i-1}][v${i}]xfade=transition=fade:duration=${transitionDuration}:offset=${offset}[v]`
        } else {
          filterComplex += `[x${i-1}][v${i}]xfade=transition=fade:duration=${transitionDuration}:offset=${offset}[x${i}];`
        }
      }
    }

    return filterComplex
  }

  private async concatenateSegments(segmentPaths: string[]): Promise<string> {
    const concatListPath = path.join(this.tempDir, 'concat-list.txt')
    const concatList = segmentPaths.map(p => `file '${path.resolve(p)}'`).join('\n')
    await fs.writeFile(concatListPath, concatList)

    const outputPath = path.join(this.tempDir, 'video-no-audio.mp4')

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(concatListPath)
        .inputOptions(['-f concat', '-safe 0'])
        .videoCodec('copy')
        .output(outputPath)
        .on('end', () => {
          fs.remove(concatListPath) // Cleanup concat list
          resolve(outputPath)
        })
        .on('error', reject)
        .run()
    })
  }

  private async addAudioTrack(
    videoPath: string,
    audioPath: string,
    outputPath: string
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(videoPath)
        .input(audioPath)
        .videoCodec('copy')
        .audioCodec('aac')
        .outputOptions([
          '-map 0:v:0',
          '-map 1:a:0',
          '-shortest', // Stop when the shortest input ends
        ])
        .output(outputPath)
        .on('end', resolve)
        .on('error', (error) => {
          console.error('Error adding audio track:', error)
          reject(error)
        })
        .run()
    })
  }

  private async getVideoMetadata(videoPath: string): Promise<{
    duration: number
    resolution: string
    format: string
  }> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (error, metadata) => {
        if (error) {
          reject(error)
          return
        }

        const videoStream = metadata.streams.find(stream => stream.codec_type === 'video')
        if (!videoStream) {
          reject(new Error('No video stream found'))
          return
        }

        resolve({
          duration: metadata.format.duration || 0,
          resolution: `${videoStream.width}x${videoStream.height}`,
          format: metadata.format.format_name || 'unknown',
        })
      })
    })
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