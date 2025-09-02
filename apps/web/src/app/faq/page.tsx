'use client'

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HelpCircle, Plus, Minus } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "What is ClipForge AI?",
        a: "ClipForge AI is an AI-powered platform that creates professional faceless videos from simple text prompts. Perfect for YouTube, TikTok, Instagram, and other social media platforms."
      },
      {
        q: "How do I get started?",
        a: "Simply sign up for a free account, choose a template, enter your script or topic, and let our AI create a professional video in minutes. No technical skills required."
      },
      {
        q: "Do I need to show my face in the videos?",
        a: "No! ClipForge AI specializes in faceless video content. We use AI voiceovers, stock footage, and graphics to create engaging videos without requiring you to appear on camera."
      }
    ]
  },
  {
    category: "Video Creation",
    questions: [
      {
        q: "What types of videos can I create?",
        a: "You can create educational content, entertainment videos, product reviews, tutorials, news summaries, and more. Our templates support various niches and styles."
      },
      {
        q: "How long does it take to generate a video?",
        a: "Most videos are ready in 3-5 minutes. Complex videos with multiple scenes may take up to 10 minutes. You'll receive notifications when your video is ready."
      },
      {
        q: "Can I customize the generated videos?",
        a: "Yes! You can edit the script, change voiceover settings, select different background music, adjust timing, and choose from various visual styles and templates."
      },
      {
        q: "What video formats and resolutions are supported?",
        a: "We support MP4 format in multiple resolutions: 540p (preview), 1080p (standard), and 4K (premium). Videos are optimized for different platforms with appropriate aspect ratios."
      }
    ]
  },
  {
    category: "Pricing & Credits",
    questions: [
      {
        q: "How does the pricing work?",
        a: "We use a credit-based system. Each video generation costs credits based on length and quality. You can purchase credit packs or subscribe to monthly plans for regular use."
      },
      {
        q: "What's the difference between preview and export?",
        a: "Previews are free, watermarked 540p videos for testing. Exports are high-quality, watermark-free videos that require credits and are available in 1080p or 4K."
      },
      {
        q: "Do credits expire?",
        a: "Purchased credit packs never expire. Monthly subscription credits reset each billing cycle, so use them before your next billing date."
      },
      {
        q: "Can I get a refund?",
        a: "We offer refunds within 30 days of purchase if you're not satisfied. Contact our support team with your concerns and we'll work to resolve them."
      }
    ]
  },
  {
    category: "Technical",
    questions: [
      {
        q: "What languages are supported?",
        a: "Currently, we support English voiceovers with plans to add Spanish, French, German, and other languages soon. You can write scripts in any language for the text elements."
      },
      {
        q: "Can I upload my own assets?",
        a: "Yes! Pro users can upload custom images, video clips, and audio files to personalize their videos further. All uploads are processed securely."
      },
      {
        q: "Is there an API available?",
        a: "We're developing an API for enterprise customers. Join our waitlist if you're interested in programmatic access to our video generation capabilities."
      },
      {
        q: "What happens to my data?",
        a: "Your data is encrypted and stored securely. We don't share your content with third parties. You own all rights to the videos you create."
      }
    ]
  },
  {
    category: "Account & Support",
    questions: [
      {
        q: "How do I delete my account?",
        a: "Go to Settings > Account > Delete Account. This will permanently remove all your data. You can also contact support if you need assistance."
      },
      {
        q: "Can I download my videos?",
        a: "Yes! All exported videos can be downloaded in MP4 format. Videos remain available in your dashboard for 90 days after creation."
      },
      {
        q: "How do I contact support?",
        a: "Use our contact form, email support@clipforge-ai.com, or chat with us through the help widget in your dashboard. We typically respond within 24 hours."
      }
    ]
  }
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="mb-4">
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{question}</CardTitle>
          {isOpen ? (
            <Minus className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Plus className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      {isOpen && (
        <CardContent className="pt-0">
          <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </CardContent>
      )}
    </Card>
  )
}

export default function FAQPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <Badge className="mb-4" variant="secondary">
                <HelpCircle className="mr-2 h-4 w-4" />
                Frequently Asked Questions
              </Badge>
              <h1 className="text-4xl font-bold mb-6">
                Got Questions? We&apos;ve Got Answers
              </h1>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about ClipForge AI
              </p>
            </div>

            {/* FAQ Categories */}
            <div className="space-y-8">
              {faqs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mr-3">
                      {categoryIndex + 1}
                    </div>
                    {category.category}
                  </h2>
                  <div className="space-y-2">
                    {category.questions.map((faq, faqIndex) => (
                      <FAQItem 
                        key={faqIndex} 
                        question={faq.q} 
                        answer={faq.a} 
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <Card className="mt-16 bg-primary text-primary-foreground">
              <CardContent className="pt-8 pb-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                <p className="mb-6 opacity-90">
                  Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
                </p>
                <div className="flex justify-center space-x-4">
                  <a 
                    href="/contact" 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background text-foreground hover:bg-background/90 h-11 px-8"
                  >
                    Contact Support
                  </a>
                  <a 
                    href="/auth/signin" 
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-primary-foreground/20 hover:bg-primary-foreground/10 h-11 px-8"
                  >
                    Sign In
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}