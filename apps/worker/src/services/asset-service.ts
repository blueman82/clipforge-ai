import fs from 'fs-extra'
import path from 'path'
import axios from 'axios'
import type { Script } from './script-generation'

export interface AssetData {
  scenes: Array<{
    sceneId: string
    assets: Array<{
      type: 'image' | 'video' | 'animation'
      url: string
      localPath: string
      duration?: number
      description: string
    }>
  }>
  tempFiles: string[]
}

export class AssetService {
  private tempDir = path.join(process.cwd(), 'temp', 'assets')

  constructor() {
    // Ensure temp directory exists
    fs.ensureDirSync(this.tempDir)
  }

  async selectAssets(script: Script): Promise<AssetData> {
    const assetData: AssetData = {
      scenes: [],
      tempFiles: [],
    }

    try {
      // Process each scene to select appropriate assets
      for (const scene of script.scenes) {
        const sceneAssets = await this.selectSceneAssets(scene.id, scene.visualDescription, scene.duration)
        
        assetData.scenes.push({
          sceneId: scene.id,
          assets: sceneAssets,
        })
        
        // Track temp files for cleanup
        sceneAssets.forEach(asset => {
          assetData.tempFiles.push(asset.localPath)
        })
      }

      return assetData
    } catch (error) {
      // Clean up any downloaded assets on error
      await this.cleanupFiles(assetData.tempFiles)
      throw error
    }
  }

  private async selectSceneAssets(sceneId: string, visualDescription: string, duration: number) {
    const assets = []

    try {
      // For demo purposes, use stock assets based on visual description
      // In production, integrate with Pexels, Unsplash, or Pixabay APIs
      
      if (process.env.PEXELS_API_KEY) {
        // Try to get relevant stock video/images from Pexels
        const pexelsAssets = await this.fetchFromPexels(visualDescription, duration)
        assets.push(...pexelsAssets)
      } else if (process.env.UNSPLASH_API_KEY) {
        // Try to get relevant images from Unsplash
        const unsplashAssets = await this.fetchFromUnsplash(visualDescription)
        assets.push(...unsplashAssets)
      } else {
        // Fallback to local placeholder assets
        const placeholderAssets = await this.generatePlaceholderAssets(sceneId, visualDescription, duration)
        assets.push(...placeholderAssets)
      }

      return assets
    } catch (error) {
      console.error(`Asset selection failed for scene ${sceneId}:`, error)
      
      // Always provide fallback assets
      return await this.generatePlaceholderAssets(sceneId, visualDescription, duration)
    }
  }

  private async fetchFromPexels(query: string, duration: number) {
    try {
      // Search for videos first (preferred for longer scenes)
      if (duration > 4) {
        const response = await axios.get('https://api.pexels.com/videos/search', {
          params: {
            query,
            per_page: 3,
            orientation: 'portrait', // For TikTok/Instagram format
          },
          headers: {
            'Authorization': process.env.PEXELS_API_KEY,
          },
        })

        const assets = []
        for (const video of response.data.videos.slice(0, 2)) {
          const localPath = await this.downloadAsset(video.video_files[0].link, 'video')
          assets.push({
            type: 'video' as const,
            url: video.video_files[0].link,
            localPath,
            duration: video.duration,
            description: video.tags?.join(', ') || query,
          })
        }

        return assets
      }

      // Search for images for shorter scenes
      const response = await axios.get('https://api.pexels.com/v1/search', {
        params: {
          query,
          per_page: 5,
          orientation: 'portrait',
        },
        headers: {
          'Authorization': process.env.PEXELS_API_KEY,
        },
      })

      const assets = []
      for (const photo of response.data.photos.slice(0, 3)) {
        const localPath = await this.downloadAsset(photo.src.large, 'image')
        assets.push({
          type: 'image' as const,
          url: photo.src.large,
          localPath,
          description: photo.alt || query,
        })
      }

      return assets
    } catch (error) {
      console.error('Pexels API failed:', error)
      return []
    }
  }

  private async fetchFromUnsplash(query: string) {
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query,
          per_page: 5,
          orientation: 'portrait',
        },
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_API_KEY}`,
        },
      })

      const assets = []
      for (const photo of response.data.results.slice(0, 3)) {
        const localPath = await this.downloadAsset(photo.urls.regular, 'image')
        assets.push({
          type: 'image' as const,
          url: photo.urls.regular,
          localPath,
          description: photo.alt_description || query,
        })
      }

      return assets
    } catch (error) {
      console.error('Unsplash API failed:', error)
      return []
    }
  }

  private async generatePlaceholderAssets(sceneId: string, description: string, duration: number) {
    // Generate colored placeholder images/videos for demo
    const assets = []
    
    // Create a simple colored image placeholder
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3']
    const color = colors[parseInt(sceneId) % colors.length] || '#45B7D1'
    
    // Generate SVG placeholder
    const svgContent = `
      <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${color}"/>
        <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
              font-family="Arial" font-size="48" fill="white" opacity="0.8">
          ${description}
        </text>
        <text x="50%" y="60%" text-anchor="middle" dominant-baseline="middle" 
              font-family="Arial" font-size="24" fill="white" opacity="0.6">
          Scene ${sceneId}
        </text>
      </svg>
    `
    
    const fileName = `placeholder-${sceneId}.svg`
    const filePath = path.join(this.tempDir, fileName)
    await fs.writeFile(filePath, svgContent)
    
    assets.push({
      type: 'image' as const,
      url: filePath,
      localPath: filePath,
      description: `Placeholder for: ${description}`,
    })

    return assets
  }

  private async downloadAsset(url: string, type: 'image' | 'video'): Promise<string> {
    const fileName = `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${type === 'video' ? 'mp4' : 'jpg'}`
    const filePath = path.join(this.tempDir, fileName)
    
    try {
      const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream',
        timeout: 30000, // 30 second timeout
      })
      
      const writer = fs.createWriteStream(filePath)
      response.data.pipe(writer)
      
      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(filePath))
        writer.on('error', reject)
      })
    } catch (error) {
      console.error(`Failed to download asset from ${url}:`, error)
      throw error
    }
  }

  async cleanupFiles(filePaths: string[]): Promise<void> {
    await Promise.all(
      filePaths.map(async (filePath) => {
        try {
          await fs.remove(filePath)
        } catch (error) {
          console.warn(`Failed to cleanup asset file ${filePath}:`, error)
        }
      })
    )
  }
}