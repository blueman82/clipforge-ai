import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Zap, Shield, Globe, Heart, Rocket } from 'lucide-react'
import Image from 'next/image'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <Badge className="mb-4" variant="secondary">About ClipForge AI</Badge>
              <h1 className="text-5xl font-bold mb-6">
                Democratizing Video Creation with AI
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We believe everyone should have the power to create professional, engaging video content 
                without expensive equipment, technical expertise, or showing their face.
              </p>
            </div>

            {/* Mission Section */}
            <Card className="mb-12">
              <CardContent className="pt-8 pb-8">
                <div className="flex items-start space-x-4">
                  <Rocket className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      To empower content creators, educators, and businesses worldwide with AI-powered tools 
                      that transform ideas into compelling faceless videos in minutes, not hours. We&apos;re 
                      removing the barriers between imagination and creation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Values Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              <Card>
                <CardContent className="pt-6">
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Community First</h3>
                  <p className="text-muted-foreground">
                    Built by creators, for creators. We listen to our community and evolve based on real needs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Speed & Simplicity</h3>
                  <p className="text-muted-foreground">
                    Complex technology made simple. Create professional videos in minutes with just a few clicks.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Shield className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Privacy & Ethics</h3>
                  <p className="text-muted-foreground">
                    Your content is yours. We prioritize data privacy and ethical AI practices in everything we do.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Globe className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Global Accessibility</h3>
                  <p className="text-muted-foreground">
                    Supporting multiple languages and making video creation accessible to everyone, everywhere.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Story Section */}
            <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                ClipForge AI was born from a simple observation: millions of people have valuable knowledge 
                and stories to share, but creating video content remains intimidating and time-consuming.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded in 2024, we set out to solve this problem using the latest advances in AI. Our team 
                of engineers, designers, and content creators came together with a shared vision: make video 
                creation as easy as writing a text message.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Today, ClipForge AI helps thousands of creators produce engaging faceless videos for YouTube, 
                TikTok, Instagram, and beyond. From educational content to entertainment, our platform enables 
                anyone to become a video creator without the traditional barriers.
              </p>
            </div>

            {/* Team Section */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-8">Built by a Passionate Team</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: 'Sarah Chen', role: 'CEO & Co-founder' },
                  { name: 'Marcus Williams', role: 'CTO & Co-founder' },
                  { name: 'Elena Rodriguez', role: 'Head of AI' },
                  { name: 'James Park', role: 'Head of Product' },
                ].map((member, index) => (
                  <div key={index} className="text-center">
                    <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <Users className="h-10 w-10 text-primary" />
                    </div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Section */}
            <Card className="bg-primary text-primary-foreground mb-16">
              <CardContent className="pt-8 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-sm opacity-90">Active Creators</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">1M+</div>
                    <div className="text-sm opacity-90">Videos Created</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">120+</div>
                    <div className="text-sm opacity-90">Countries</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">4.9</div>
                    <div className="text-sm opacity-90">User Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact CTA */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Be part of the video creation revolution
              </p>
              <div className="flex justify-center space-x-4">
                <a href="/auth/signup" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
                  Get Started Free
                </a>
                <a href="/contact" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}