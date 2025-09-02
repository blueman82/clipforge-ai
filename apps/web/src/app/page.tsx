import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { CTA } from '@/components/sections/cta'
import { Features } from '@/components/sections/features'
import { Hero } from '@/components/sections/hero'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Pricing } from '@/components/sections/pricing'
import { SocialProof } from '@/components/sections/social-proof'
import { VideoCarousel } from '@/components/sections/video-carousel'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col">
        <Hero />
        <VideoCarousel />
        <SocialProof />
        <Features />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  )
}