'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Zap, 
  Video, 
  Mic, 
  Image, 
  Download,
  Users,
  Globe,
  Shield,
  Clock,
  Palette,
  Music,
  FileText,
  Sparkles,
  Target,
  TrendingUp,
  Crown
} from 'lucide-react'

const features = [
  {
    category: "AI-Powered Creation",
    items: [
      {
        icon: Sparkles,
        title: "Smart Script Generation",
        description: "Transform any topic into engaging video scripts with AI-powered content creation.",
        badge: "New"
      },
      {
        icon: Mic,
        title: "Natural Voice Synthesis",
        description: "Choose from 50+ realistic AI voices in multiple languages and accents.",
        badge: null
      },
      {
        icon: Video,
        title: "Automated Video Assembly",
        description: "AI automatically selects and synchronizes visuals with your voiceover.",
        badge: null
      },
      {
        icon: Target,
        title: "Content Optimization",
        description: "AI optimizes your content for maximum engagement on each platform.",
        badge: "Pro"
      }
    ]
  },
  {
    category: "Professional Templates",
    items: [
      {
        icon: FileText,
        title: "YouTube Shorts",
        description: "Vertical format optimized for YouTube's algorithm with trending styles.",
        badge: null
      },
      {
        icon: TrendingUp,
        title: "TikTok Viral",
        description: "Fast-paced templates designed to capture attention and go viral.",
        badge: null
      },
      {
        icon: Image,
        title: "Instagram Reels",
        description: "Story-driven templates perfect for Instagram's visual-first audience.",
        badge: null
      },
      {
        icon: Crown,
        title: "Custom Templates",
        description: "Create and save your own templates for consistent branding.",
        badge: "Pro"
      }
    ]
  },
  {
    category: "Media & Assets",
    items: [
      {
        icon: Video,
        title: "Stock Video Library",
        description: "Access millions of high-quality stock videos from premium providers.",
        badge: null
      },
      {
        icon: Image,
        title: "AI-Generated Visuals",
        description: "Create unique visuals with integrated AI image generation.",
        badge: "Beta"
      },
      {
        icon: Music,
        title: "Royalty-Free Music",
        description: "Extensive library of background music and sound effects.",
        badge: null
      },
      {
        icon: Palette,
        title: "Dynamic Captions",
        description: "Auto-generated captions with customizable styles and animations.",
        badge: null
      }
    ]
  },
  {
    category: "Export & Sharing",
    items: [
      {
        icon: Download,
        title: "Multiple Formats",
        description: "Export in 540p, 1080p, or 4K with platform-specific optimizations.",
        badge: null
      },
      {
        icon: Clock,
        title: "Fast Rendering",
        description: "Most videos ready in under 5 minutes with cloud processing power.",
        badge: null
      },
      {
        icon: Shield,
        title: "Watermark-Free",
        description: "Clean exports without watermarks for paid plans.",
        badge: "Pro"
      },
      {
        icon: Globe,
        title: "Direct Publishing",
        description: "Publish directly to YouTube, TikTok, and Instagram from the dashboard.",
        badge: "Coming Soon"
      }
    ]
  },
  {
    category: "Collaboration & Analytics",
    items: [
      {
        icon: Users,
        title: "Team Collaboration",
        description: "Share projects with team members and collaborate in real-time.",
        badge: "Enterprise"
      },
      {
        icon: TrendingUp,
        title: "Performance Analytics",
        description: "Track video performance and engagement metrics across platforms.",
        badge: "Pro"
      },
      {
        icon: FileText,
        title: "Content Calendar",
        description: "Plan and schedule your video content with our built-in calendar.",
        badge: "Pro"
      },
      {
        icon: Zap,
        title: "Bulk Creation",
        description: "Create multiple videos from a single script with different variations.",
        badge: "Enterprise"
      }
    ]
  }
]

function FeatureCard({ icon: Icon, title, description, badge }: {
  icon: any;
  title: string;
  description: string;
  badge?: string | null;
}) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {badge && (
            <Badge 
              variant={badge === 'Pro' ? 'default' : badge === 'New' ? 'secondary' : 'outline'}
              className="text-xs"
            >
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <Badge className="mb-4" variant="secondary">
                <Sparkles className="mr-2 h-4 w-4" />
                Powerful Features
              </Badge>
              <h1 className="text-5xl font-bold mb-6">
                Everything You Need to Create
                <span className="block text-primary">Amazing Faceless Videos</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From AI-powered script generation to professional exports, ClipForge AI provides 
                all the tools you need to create engaging video content at scale.
              </p>
            </div>

            {/* Feature Categories */}
            <div className="space-y-16">
              {features.map((category, categoryIndex) => (
                <section key={categoryIndex}>
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">{category.category}</h2>
                    <div className="w-24 h-1 bg-primary mx-auto"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {category.items.map((feature, featureIndex) => (
                      <FeatureCard
                        key={featureIndex}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        badge={feature.badge}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center mt-20">
              <Card className="bg-primary text-primary-foreground p-8">
                <CardContent className="pt-0">
                  <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                  <p className="text-xl mb-8 opacity-90">
                    Join thousands of creators who are already using ClipForge AI to grow their audience
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button 
                      size="lg" 
                      className="bg-background text-foreground hover:bg-background/90"
                    >
                      Start Creating Free
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-primary-foreground/20 hover:bg-primary-foreground/10"
                    >
                      View Pricing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Feature Comparison */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle>Free</CardTitle>
                    <CardDescription>Perfect for trying out ClipForge</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Watermarked exports</span>
                        <span>✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>540p resolution</span>
                        <span>✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Basic templates</span>
                        <span>✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>5 videos/month</span>
                        <span>✓</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center border-primary">
                  <CardHeader>
                    <Badge className="mb-2">Most Popular</Badge>
                    <CardTitle>Pro</CardTitle>
                    <CardDescription>For serious content creators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Watermark-free exports</span>
                        <span>✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>1080p + 4K resolution</span>
                        <span>✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>All templates</span>
                        <span>✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Unlimited videos</span>
                        <span>✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Analytics & scheduling</span>
                        <span>✓</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <CardTitle>Enterprise</CardTitle>
                    <CardDescription>For teams and agencies</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Everything in Pro</span>
                        <span>✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Team collaboration</span>
                        <span>✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Bulk creation</span>
                        <span>✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Priority support</span>
                        <span>✓</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Custom integrations</span>
                        <span>✓</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}