'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    avatar: '/avatars/sarah.jpg',
    initials: 'SC',
  },
  {
    id: 2,
    name: 'Mike Johnson',
    avatar: '/avatars/mike.jpg',
    initials: 'MJ',
  },
  {
    id: 3,
    name: 'Emily Davis',
    avatar: '/avatars/emily.jpg',
    initials: 'ED',
  },
  {
    id: 4,
    name: 'Alex Kumar',
    avatar: '/avatars/alex.jpg',
    initials: 'AK',
  },
  {
    id: 5,
    name: 'Lisa Wong',
    avatar: '/avatars/lisa.jpg',
    initials: 'LW',
  },
]

export function SocialProof() {
  return (
    <section className="py-12 border-y">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8"
        >
          <div className="flex -space-x-2">
            {testimonials.map((person) => (
              <Avatar key={person.id} className="border-2 border-background">
                <AvatarImage src={person.avatar} alt={person.name} />
                <AvatarFallback>{person.initials}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 font-semibold">4.9/5</span>
          </div>
          
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">Trusted by</p>
            <p className="text-2xl font-bold">12,500+ Creators</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}