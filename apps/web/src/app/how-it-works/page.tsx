'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Play,
  FileText,
  Mic,
  Video,
  Download,
  ArrowRight,
  Clock,
  Sparkles,
  Palette,
  Share2,
  CheckCircle,
  Users,
  TrendingUp
} from 'lucide-react'

const steps = [
  {
    number: 1,
    title: "Choose Your Topic",
    description: "Start by selecting a topic or niche for your video. Our AI will help you brainstorm ideas that are trending and engaging.",
    icon: FileText,
    details: [
      "Browse trending topics in your niche",
      "Use our AI topic generator",
      "Import your own content ideas",
      "Research competitor content"
    ],
    time: "30 seconds"
  },
  {
    number: 2,
    title: "AI Script Generation",
    description: "Our advanced AI creates compelling scripts tailored to your chosen platform and audience, optimized for engagement.",
    icon: Sparkles,
    details: [
      "Platform-specific optimization (YouTube, TikTok, Instagram)",
      "Hook-driven opening lines",
      "Call-to-action integration",
      "SEO-friendly keywords"
    ],
    time: "1 minute"
  },
  {
    number: 3,
    title: "Voice Selection",
    description: "Choose from 50+ realistic AI voices in multiple languages and accents. Each voice is designed for maximum engagement.",
    icon: Mic,
    details: [
      "Male and female voice options",
      "Multiple accents and languages",
      "Emotional tone customization",
      "Speed and pitch control"
    ],
    time: "1 minute"
  },
  {
    number: 4,
    title: "Visual Assembly",
    description: "Our AI automatically selects and synchronizes visuals with your voiceover from our massive stock library.",
    icon: Video,
    details: [
      "Millions of high-quality stock videos",
      "AI-powered scene matching",
      "Smooth transitions and effects",
      "Custom branding integration"
    ],
    time: "2 minutes"
  },
  {
    number: 5,
    title: "Customize & Style",
    description: "Fine-tune your video with custom templates, captions, music, and branding to match your unique style.",
    icon: Palette,
    details: [
      "Professional templates",
      "Dynamic caption styles",
      "Background music library",
      "Logo and watermark placement"
    ],
    time: "2 minutes"
  },
  {
    number: 6,
    title: "Export & Share",
    description: "Export in multiple formats optimized for each platform, then share directly or download for later use.",
    icon: Download,
    details: [
      "Platform-specific formats (9:16, 16:9, 1:1)",
      "Multiple quality options (540p to 4K)",
      "Watermark-free exports (Pro)",
      "Direct platform publishing"
    ],
    time: "1 minute"
  }
]

const benefits = [
  {
    icon: Clock,
    title: "Save 90% of Your Time",
    description: "Create professional videos in minutes instead of hours"
  },
  {
    icon: TrendingUp,
    title: "Boost Engagement",
    description: "AI-optimized content designed to maximize views and engagement"
  },
  {
    icon: Users,
    title: "Scale Your Content",
    description: "Create multiple videos per day with consistent quality"
  },
  {
    icon: Share2,
    title: "Multi-Platform Ready",
    description: "One-click export for YouTube, TikTok, Instagram, and more"
  }
]

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-20">
              <Badge className="mb-4" variant="secondary">
                <Play className="mr-2 h-4 w-4" />
                Simple Process
              </Badge>
              <h1 className="text-5xl font-bold mb-6">
                From Idea to Viral Video
                <span className="block text-primary">In 6 Simple Steps</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See exactly how ClipForge AI transforms your ideas into engaging faceless videos 
                that capture attention and drive results across all major platforms.
              </p>
            </div>

            {/* Process Steps */}
            <div className="space-y-16 mb-20">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 top-20 w-0.5 h-32 bg-gradient-to-b from-primary to-primary/20 hidden lg:block" />
                  )}
                  
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className={`order-2 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="flex items-center mb-6">
                        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full text-primary-foreground font-bold text-xl mr-4">
                          {step.number}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold">{step.title}</h2>
                          <div className="flex items-center mt-2 text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">{step.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-lg text-muted-foreground mb-6">
                        {step.description}
                      </p>
                      
                      <ul className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className={`order-1 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                      <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardContent className="flex items-center justify-center min-h-[300px]">
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-4">
                              <step.icon className="h-12 w-12 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Step {step.number}</h3>
                            <p className="text-muted-foreground">{step.title}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Benefits Section */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Creators Choose ClipForge AI</h2>
              <p className="text-xl text-muted-foreground mb-12">
                Join thousands of creators who are scaling their content with AI
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-0">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                        <benefit.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Time Breakdown */}
            <Card className="mb-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">Total Time: Under 8 Minutes</h2>
                <p className="text-xl mb-6 opacity-90">
                  From concept to published video in less time than it takes to make coffee
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm opacity-90">
                  <span>✓ Topic Selection (30s)</span>
                  <span>✓ AI Script (1m)</span>
                  <span>✓ Voice Selection (1m)</span>
                  <span>✓ Visual Assembly (2m)</span>
                  <span>✓ Customization (2m)</span>
                  <span>✓ Export (1m)</span>
                </div>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <div className="text-center">
              <Card className="p-8">
                <CardContent className="pt-0">
                  <h2 className="text-3xl font-bold mb-4">Ready to Create Your First Video?</h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Start creating professional faceless videos in minutes
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button size="lg" className="text-lg px-8">
                      Start Creating Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="lg" className="text-lg px-8">
                      Watch Demo Video
                      <Play className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    No credit card required • 5 free videos included
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}