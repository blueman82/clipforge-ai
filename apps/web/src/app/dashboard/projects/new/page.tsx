'use client'

import { 
  ArrowLeft,
  Smartphone,
  Monitor,
  Square,
  Play,
  Wand2
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'


const templates = [
  {
    id: 'tiktok-vertical',
    name: 'TikTok Style',
    description: 'Perfect for TikTok, Instagram Reels, and YouTube Shorts',
    aspectRatio: '9:16',
    icon: Smartphone,
    popular: true,
  },
  {
    id: 'youtube-horizontal',
    name: 'YouTube Horizontal',
    description: 'Standard format for YouTube videos and presentations',
    aspectRatio: '16:9',
    icon: Monitor,
    popular: false,
  },
  {
    id: 'instagram-square',
    name: 'Instagram Square',
    description: 'Square format perfect for Instagram posts',
    aspectRatio: '1:1',
    icon: Square,
    popular: false,
  },
]

const niches = [
  { id: 'tech', name: 'Technology', description: 'Tech tips, reviews, and tutorials' },
  { id: 'lifestyle', name: 'Lifestyle', description: 'Life hacks, wellness, and productivity' },
  { id: 'education', name: 'Education', description: 'Learning content and educational topics' },
  { id: 'business', name: 'Business', description: 'Entrepreneurship and business tips' },
  { id: 'entertainment', name: 'Entertainment', description: 'Fun facts and entertaining content' },
  { id: 'health', name: 'Health & Fitness', description: 'Wellness, fitness, and health tips' },
]

export default function NewProjectPage() {
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('')
  const [projectTitle, setProjectTitle] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const router = useRouter()

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Create project - would integrate with API
      console.log('Creating project:', {
        template: selectedTemplate,
        niche: selectedNiche,
        title: projectTitle,
        prompt: customPrompt,
      })
      router.push('/dashboard/projects')
    }
  }

  const canProceed = () => {
    if (step === 1) return selectedTemplate
    if (step === 2) return selectedNiche
    if (step === 3) return projectTitle.trim()
    return false
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
          <p className="text-muted-foreground">
            Let's create your next viral video in just a few steps.
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div
                className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Choose Template */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Format</CardTitle>
            <CardDescription>
              Select the video format that best fits your target platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`relative p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                    selectedTemplate === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  {template.popular && (
                    <Badge className="absolute -top-2 -right-2">Popular</Badge>
                  )}
                  <template.icon className="h-8 w-8 mb-4" />
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {template.description}
                  </p>
                  <Badge variant="outline">{template.aspectRatio}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Choose Niche */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Your Niche</CardTitle>
            <CardDescription>
              Choose the content category that matches your video topic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {niches.map((niche) => (
                <div
                  key={niche.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary ${
                    selectedNiche === niche.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                  onClick={() => setSelectedNiche(niche.id)}
                >
                  <h3 className="font-semibold mb-2">{niche.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {niche.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Project Details */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Give your project a title and optionally provide a custom prompt.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Project Title *
              </label>
              <input
                id="title"
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g., 10 Life Hacks That Will Change Your Day"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                Custom Prompt (Optional)
              </label>
              <textarea
                id="prompt"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Provide specific instructions for your video content... (Leave empty to let AI generate automatically)"
                rows={4}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                AI will automatically generate engaging content if left empty.
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Project Summary</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Format:</strong> {templates.find(t => t.id === selectedTemplate)?.name}</p>
                <p><strong>Niche:</strong> {niches.find(n => n.id === selectedNiche)?.name}</p>
                <p><strong>Title:</strong> {projectTitle || 'Untitled Project'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
        >
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!canProceed()}>
          {step === 3 ? (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Create Project
            </>
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </div>
  )
}