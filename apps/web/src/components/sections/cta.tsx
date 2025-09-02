'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative isolate overflow-hidden bg-gradient-to-br from-primary to-primary/80 px-6 pt-16 shadow-2xl rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0"
        >
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#gradient)"
              fillOpacity="0.7"
            />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="white" />
                <stop offset={1} stopColor="white" stopOpacity={0} />
              </radialGradient>
            </defs>
          </svg>
          
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Go Viral?
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/90">
              Join thousands of creators who are already using ClipForge AI to dominate social media. 
              Start your free trial today and create your first video in minutes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <Button 
                size="lg" 
                variant="secondary"
                className="group"
                asChild
              >
                <Link href="/auth/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Link 
                href="/pricing" 
                className="text-sm font-semibold leading-6 text-white hover:text-white/90"
              >
                View pricing <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          
          <div className="relative mt-16 h-80 lg:mt-8">
            <div className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10">
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[9/16] rounded bg-white/10 animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}