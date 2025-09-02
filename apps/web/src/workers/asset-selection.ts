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

interface AssetJobData {
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
  timingMap: any
  template: any
  quality: string
  watermark: boolean
}

interface AssetProvider {
  searchAssets(query: string, type: 'video' | 'image', options?: any): Promise<AssetSearchResult[]>
  downloadAsset(asset: AssetSearchResult, localPath: string): Promise<string>
}

interface AssetSearchResult {
  id: string
  type: 'video' | 'image'
  url: string
  downloadUrl: string
  thumbnail: string
  title: string
  duration?: number
  resolution?: { width: number; height: number }
  tags: string[]
  license: string
  provider: string
}

class PexelsProvider implements AssetProvider {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.PEXELS_API_KEY || ''
    if (!this.apiKey) {
      console.warn('Pexels API key not configured')
    }
  }

  async searchAssets(query: string, type: 'video' | 'image', options = {}): Promise<AssetSearchResult[]> {
    if (!this.apiKey) {
      throw new Error('Pexels API key not configured')
    }

    try {
      const endpoint = type === 'video' 
        ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=20&size=medium`
        : `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20&size=medium`

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`)
      }

      const data = await response.json()
      
      if (type === 'video') {
        return data.videos?.map((video: any) => ({
          id: video.id.toString(),
          type: 'video' as const,
          url: video.url,
          downloadUrl: video.video_files?.[0]?.link || '',
          thumbnail: video.image,
          title: `Video ${video.id}`,
          duration: video.duration,
          resolution: { 
            width: video.video_files?.[0]?.width || 1920, 
            height: video.video_files?.[0]?.height || 1080 
          },
          tags: video.tags?.split(',') || [],
          license: 'Pexels License',
          provider: 'pexels',
        })) || []
      } else {
        return data.photos?.map((photo: any) => ({
          id: photo.id.toString(),
          type: 'image' as const,
          url: photo.url,
          downloadUrl: photo.src?.large || photo.src?.original || '',
          thumbnail: photo.src?.medium || '',
          title: photo.alt || `Photo ${photo.id}`,
          resolution: { width: photo.width, height: photo.height },
          tags: [photo.alt].filter(Boolean),
          license: 'Pexels License',
          provider: 'pexels',
        })) || []
      }
    } catch (error) {
      console.error('Pexels API error:', error)
      throw error
    }
  }

  async downloadAsset(asset: AssetSearchResult, localPath: string): Promise<string> {
    try {
      const response = await fetch(asset.downloadUrl)
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`)
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      await fs.writeFile(localPath, buffer)
      return localPath
    } catch (error) {
      console.error('Asset download error:', error)
      throw error
    }
  }
}

class UnsplashProvider implements AssetProvider {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.UNSPLASH_ACCESS_KEY || ''
    if (!this.apiKey) {
      console.warn('Unsplash API key not configured')
    }
  }

  async searchAssets(query: string, type: 'video' | 'image'): Promise<AssetSearchResult[]> {
    if (type === 'video') {
      return [] // Unsplash doesn't have videos
    }

    if (!this.apiKey) {
      throw new Error('Unsplash API key not configured')
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=20`,
        {
          headers: {
            'Authorization': `Client-ID ${this.apiKey}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`)
      }

      const data = await response.json()
      
      return data.results?.map((photo: any) => ({
        id: photo.id,
        type: 'image' as const,
        url: photo.links?.html || '',
        downloadUrl: photo.urls?.full || photo.urls?.raw || '',
        thumbnail: photo.urls?.thumb || '',
        title: photo.alt_description || `Photo by ${photo.user?.name}`,
        resolution: { width: photo.width, height: photo.height },
        tags: photo.tags?.map((tag: any) => tag.title) || [],
        license: 'Unsplash License',
        provider: 'unsplash',
      })) || []
    } catch (error) {
      console.error('Unsplash API error:', error)
      throw error
    }
  }

  async downloadAsset(asset: AssetSearchResult, localPath: string): Promise<string> {
    try {
      const response = await fetch(asset.downloadUrl)
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`)
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      await fs.writeFile(localPath, buffer)
      return localPath
    } catch (error) {
      console.error('Asset download error:', error)
      throw error
    }
  }
}

class MockAssetProvider implements AssetProvider {
  async searchAssets(query: string, type: 'video' | 'image'): Promise<AssetSearchResult[]> {
    // Generate mock assets for development
    return Array.from({ length: 5 }, (_, i) => ({
      id: `mock-${type}-${i + 1}`,
      type,
      url: `https://example.com/mock-${type}-${i + 1}`,
      downloadUrl: `https://picsum.photos/1920/1080?random=${i + 1}`, // Placeholder service
      thumbnail: `https://picsum.photos/400/300?random=${i + 1}`,
      title: `Mock ${type} for "${query}" (${i + 1})`,
      duration: type === 'video' ? 10 + i * 2 : undefined,
      resolution: { width: 1920, height: 1080 },
      tags: query.split(' ').slice(0, 3),
      license: 'Mock License',
      provider: 'mock',
    }))
  }

  async downloadAsset(asset: AssetSearchResult, localPath: string): Promise<string> {
    // Create a placeholder file for development
    const placeholderContent = `Mock ${asset.type} asset: ${asset.title}`
    await fs.writeFile(localPath, Buffer.from(placeholderContent))
    return localPath
  }
}

function getAssetProvider(provider: string): AssetProvider {
  switch (provider) {
    case 'pexels':
      return new PexelsProvider()
    case 'unsplash':
      return new UnsplashProvider()
    default:
      return new MockAssetProvider()
  }
}

function extractKeywords(text: string): string[] {
  // Extract meaningful keywords from scene text
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'have', 'will', 'been', 'from', 'they', 'them', 'were', 'said', 'what', 'make', 'like', 'time', 'very', 'when', 'come', 'here', 'just', 'long', 'over', 'also', 'back', 'after', 'first', 'well', 'year'].includes(word))
    .slice(0, 5)

  return words.length > 0 ? words : ['nature', 'abstract']
}

const assetSelectionWorker = new Worker(
  'asset-selection',
  async (job: Job<AssetJobData>) => {
    const { projectId, userId, processedScenes, audioSegments, timingMap, template } = job.data
    
    try {
      // Update project progress
      await prisma.project.update({
        where: { id: projectId },
        data: { progress: 30 },
      })

      job.updateProgress(10)

      const provider = getAssetProvider(process.env.ASSET_PROVIDER || 'mock')
      const selectedAssets: Array<{
        sceneId: string
        assetType: 'video' | 'image'
        asset: AssetSearchResult
        localPath?: string
        startTime: number
        endTime: number
        duration: number
      }> = []

      // Create temp directory for assets
      const tempDir = path.join(process.cwd(), 'temp', projectId, 'assets')
      await fs.mkdir(tempDir, { recursive: true })

      // Process each scene to find matching assets
      for (let i = 0; i < processedScenes.length; i++) {
        const scene = processedScenes[i]
        const audioSegment = audioSegments.find(seg => seg.sceneId === scene.sceneId)
        
        if (!audioSegment) {
          console.warn(`No audio segment found for scene ${scene.sceneId}`)
          continue
        }

        try {
          console.log(`Selecting assets for scene ${scene.sceneId}: ${scene.text.substring(0, 50)}...`)

          // Extract keywords for asset search
          const keywords = extractKeywords(scene.text)
          const searchQuery = keywords.slice(0, 3).join(' ') || 'abstract nature'

          // Determine asset type based on template and scene type
          const preferredAssetType: 'video' | 'image' = template.assetTypes?.[scene.type] || 
            (scene.duration > 5 ? 'video' : 'image')

          // Search for assets
          const searchResults = await provider.searchAssets(searchQuery, preferredAssetType)
          
          if (searchResults.length === 0) {
            // Fallback search with broader terms
            const fallbackResults = await provider.searchAssets('nature abstract', preferredAssetType)
            searchResults.push(...fallbackResults)
          }

          // Select best matching asset (first result for now, could add scoring)
          const selectedAsset = searchResults[0]
          if (!selectedAsset) {
            throw new Error(`No assets found for scene ${scene.sceneId}`)
          }

          // Download asset if needed
          let localPath: string | undefined
          if (selectedAsset.downloadUrl) {
            const extension = preferredAssetType === 'video' ? 'mp4' : 'jpg'
            const filename = `${scene.sceneId}-asset.${extension}`
            localPath = path.join(tempDir, filename)
            
            try {
              await provider.downloadAsset(selectedAsset, localPath)
            } catch (downloadError) {
              console.warn(`Failed to download asset for ${scene.sceneId}:`, downloadError)
              localPath = undefined
            }
          }

          selectedAssets.push({
            sceneId: scene.sceneId,
            assetType: preferredAssetType,
            asset: selectedAsset,
            localPath,
            startTime: audioSegment.startTime,
            endTime: audioSegment.endTime,
            duration: audioSegment.duration,
          })

          // Update progress
          const progressPercent = 20 + Math.floor((i + 1) / processedScenes.length * 60)
          job.updateProgress(progressPercent)

        } catch (error) {
          console.error(`Asset selection failed for scene ${scene.sceneId}:`, error)
          
          // Create fallback asset entry
          selectedAssets.push({
            sceneId: scene.sceneId,
            assetType: 'image',
            asset: {
              id: `fallback-${scene.sceneId}`,
              type: 'image',
              url: '',
              downloadUrl: '',
              thumbnail: '',
              title: `Fallback for ${scene.sceneId}`,
              resolution: { width: 1920, height: 1080 },
              tags: ['fallback'],
              license: 'Fallback',
              provider: 'fallback',
            },
            startTime: audioSegment.startTime,
            endTime: audioSegment.endTime,
            duration: audioSegment.duration,
          })
        }
      }

      job.updateProgress(85)

      // Update project with asset data
      await prisma.project.update({
        where: { id: projectId },
        data: { 
          progress: 90,
          script: JSON.stringify({
            scenes: processedScenes,
            audioSegments,
            timingMap,
            selectedAssets,
          }),
        },
      })

      job.updateProgress(95)

      // Trigger next stage - Video Composition
      const { Queue } = await import('bullmq')
      const compositionJobQueue = new Queue('video-composition', { connection: redis })
      
      await compositionJobQueue.add(`composition-${projectId}`, {
        ...job.data,
        selectedAssets,
      })

      job.updateProgress(100)

      return { success: true, selectedAssets }
    } catch (error) {
      console.error('Asset selection failed:', error)
      
      await prisma.project.update({
        where: { id: projectId },
        data: { status: 'FAILED', progress: 0 },
      })
      
      throw error
    }
  },
  {
    connection: redis,
    concurrency: 1, // Limit concurrency due to API rate limits
  }
)

assetSelectionWorker.on('completed', (job) => {
  console.log(`Asset selection completed for job ${job.id}`)
})

assetSelectionWorker.on('failed', (job, err) => {
  console.error(`Asset selection failed for job ${job?.id}:`, err)
})

export default assetSelectionWorker