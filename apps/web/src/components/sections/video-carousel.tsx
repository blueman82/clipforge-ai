'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Play, Volume2 } from 'lucide-react'
import { useRef } from 'react'

import { Card } from '@/components/ui/card'


const sampleVideos = [
  {
    id: 1,
    title: 'Motivational Story',
    thumbnail: '/thumbnails/motivational.jpg',
    duration: '0:58',
    views: '125K',
    platform: 'TikTok',
  },
  {
    id: 2,
    title: 'Tech Facts',
    thumbnail: '/thumbnails/tech.jpg',
    duration: '0:45',
    views: '89K',
    platform: 'YouTube Shorts',
  },
  {
    id: 3,
    title: 'Life Hacks',
    thumbnail: '/thumbnails/lifehacks.jpg',
    duration: '0:32',
    views: '210K',
    platform: 'Instagram Reels',
  },
  {
    id: 4,
    title: 'History Facts',
    thumbnail: '/thumbnails/history.jpg',
    duration: '1:00',
    views: '156K',
    platform: 'TikTok',
  },
  {
    id: 5,
    title: 'Science Explained',
    thumbnail: '/thumbnails/science.jpg',
    duration: '0:52',
    views: '97K',
    platform: 'YouTube Shorts',
  },
]

export function VideoCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollXProgress } = useScroll({ container: containerRef })
  const x = useTransform(scrollXProgress, [0, 1], ['0%', '-100%'])

  return (
    <section className="py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Videos Created with ClipForge
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See what our users are creating every day
          </p>
        </div>

        <div 
          ref={containerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
        >
          {[...sampleVideos, ...sampleVideos].map((video, index) => (
            <motion.div
              key={`${video.id}-${index}`}
              className="flex-none w-72"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="overflow-hidden cursor-pointer group">
                <div className="relative aspect-[9/16] bg-muted">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-2 py-1 text-xs font-medium bg-black/50 backdrop-blur rounded text-white">
                      {video.platform}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h3 className="text-white font-semibold">{video.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/80">
                      <span className="flex items-center gap-1">
                        <Play className="w-3 h-3" />
                        {video.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Volume2 className="w-3 h-3" />
                        {video.duration}
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-black ml-1" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}