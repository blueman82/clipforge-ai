'use client'

import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Mic, 
  Film, 
  Palette, 
  Zap, 
  Globe,
  BarChart3,
  Shield,
  Headphones
} from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'AI Script Generation',
    description: 'Generate engaging scripts tailored to your niche with advanced AI models.',
  },
  {
    icon: Mic,
    title: 'Natural Voiceovers',
    description: 'Choose from 100+ realistic voices in multiple languages and accents.',
  },
  {
    icon: Film,
    title: 'Auto Video Editing',
    description: 'Automatically sync visuals, captions, and music to create professional videos.',
  },
  {
    icon: Palette,
    title: 'Custom Branding',
    description: 'Add your logo, colors, and fonts to maintain consistent brand identity.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate videos in under 2 minutes with our optimized rendering pipeline.',
  },
  {
    icon: Globe,
    title: 'Multi-Platform Export',
    description: 'Export in optimal formats for TikTok, YouTube Shorts, Instagram Reels, and more.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track video performance and get insights to improve engagement.',
  },
  {
    icon: Shield,
    title: 'Copyright Safe',
    description: 'All assets are royalty-free and safe for commercial use.',
  },
  {
    icon: Headphones,
    title: 'Background Music',
    description: 'Access a library of trending sounds and copyright-free music.',
  },
]

export function Features() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Everything You Need to Create Viral Content
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Powerful features designed for content creators
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative bg-background p-6 rounded-lg border">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}