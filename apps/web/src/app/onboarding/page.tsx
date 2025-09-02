'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Video, Mic, Globe, Target } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to ClipForge AI!',
    description: 'Let\'s set up your account to create amazing videos'
  },
  {
    id: 'niche',
    title: 'What\'s your niche?',
    description: 'Tell us what type of content you want to create'
  },
  {
    id: 'language',
    title: 'Choose your language',
    description: 'Select your preferred language for video narration'
  },
  {
    id: 'voice',
    title: 'Voice preferences',
    description: 'Configure your voice settings'
  },
  {
    id: 'complete',
    title: 'You\'re all set!',
    description: 'Your account is configured and ready to use'
  }
]

const niches = [
  { id: 'tech', label: 'Technology & AI', icon: '💻' },
  { id: 'business', label: 'Business & Finance', icon: '💼' },
  { id: 'lifestyle', label: 'Lifestyle & Health', icon: '🌱' },
  { id: 'education', label: 'Education & Learning', icon: '📚' },
  { id: 'entertainment', label: 'Entertainment & Gaming', icon: '🎮' },
  { id: 'news', label: 'News & Current Events', icon: '📰' },
  { id: 'travel', label: 'Travel & Adventure', icon: '✈️' },
  { id: 'food', label: 'Food & Cooking', icon: '🍳' },
  { id: 'sports', label: 'Sports & Fitness', icon: '⚽' },
  { id: 'other', label: 'Other', icon: '🎯' }
]

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' }
]

const voiceOptions = [
  { id: 'male-professional', name: 'Professional Male', description: 'Clear, authoritative voice for business content' },
  { id: 'female-professional', name: 'Professional Female', description: 'Warm, engaging voice for educational content' },
  { id: 'male-casual', name: 'Casual Male', description: 'Friendly, conversational tone for lifestyle content' },
  { id: 'female-casual', name: 'Casual Female', description: 'Energetic, upbeat voice for entertainment content' },
  { id: 'neutral', name: 'Neutral AI', description: 'Clear, neutral voice for news and factual content' }
]

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    niche: '',
    customNiche: '',
    language: 'en',
    voicePreference: '',
    additionalNotes: ''
  })

  // Redirect to login if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin?callbackUrl=/onboarding')
    return null
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // Save onboarding data to the user profile
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        // Move to completion step
        setCurrentStep(steps.length - 1)
        // After a delay, redirect to dashboard
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        console.error('Failed to save onboarding data')
      }
    } catch (error) {
      console.error('Error saving onboarding data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return true
      case 1: return formData.niche !== '' && (formData.niche !== 'other' || formData.customNiche !== '')
      case 2: return formData.language !== ''
      case 3: return formData.voicePreference !== ''
      default: return true
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  {currentStep === 0 && <Video className="w-6 h-6 text-primary" />}
                  {currentStep === 1 && <Target className="w-6 h-6 text-primary" />}
                  {currentStep === 2 && <Globe className="w-6 h-6 text-primary" />}
                  {currentStep === 3 && <Mic className="w-6 h-6 text-primary" />}
                  {currentStep === 4 && <Check className="w-6 h-6 text-primary" />}
                </div>
                <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
                <CardDescription className="text-base">
                  {steps[currentStep].description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Welcome Step */}
                {currentStep === 0 && (
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      Hi {session.user?.name || 'there'}! We'll ask you a few questions to personalize your ClipForge AI experience.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                          <Target className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="font-semibold">Choose Your Niche</h3>
                        <p className="text-sm text-muted-foreground">Tell us what you create</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                          <Globe className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="font-semibold">Set Language</h3>
                        <p className="text-sm text-muted-foreground">Pick your preferred language</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
                          <Mic className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="font-semibold">Voice Preferences</h3>
                        <p className="text-sm text-muted-foreground">Configure your AI voice</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Niche Step */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Select your primary niche:</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {niches.map((niche) => (
                        <button
                          key={niche.id}
                          onClick={() => setFormData({ ...formData, niche: niche.id })}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            formData.niche === niche.id
                              ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{niche.icon}</span>
                            <span className="font-medium text-sm">{niche.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    {formData.niche === 'other' && (
                      <div className="space-y-2">
                        <Label htmlFor="customNiche">Please specify your niche:</Label>
                        <Input
                          id="customNiche"
                          placeholder="e.g., Photography, Music Production, etc."
                          value={formData.customNiche}
                          onChange={(e) => setFormData({ ...formData, customNiche: e.target.value })}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Language Step */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Choose your preferred language:</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setFormData({ ...formData, language: lang.code })}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            formData.language === lang.code
                              ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{lang.flag}</span>
                            <span className="font-medium">{lang.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Voice Step */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Select your preferred voice style:</Label>
                    <div className="space-y-3">
                      {voiceOptions.map((voice) => (
                        <button
                          key={voice.id}
                          onClick={() => setFormData({ ...formData, voicePreference: voice.id })}
                          className={`w-full p-4 rounded-lg border text-left transition-all ${
                            formData.voicePreference === voice.id
                              ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="font-medium">{voice.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">{voice.description}</div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="space-y-2 pt-4">
                      <Label htmlFor="notes">Additional notes (optional):</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any specific requirements or preferences..."
                        value={formData.additionalNotes}
                        onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Completion Step */}
                {currentStep === 4 && (
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold">Account Setup Complete!</h3>
                    <p className="text-muted-foreground">
                      Your preferences have been saved. You'll be redirected to your dashboard in a moment.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 text-sm">
                      <div><strong>Niche:</strong> {
                        formData.niche === 'other' ? formData.customNiche : 
                        niches.find(n => n.id === formData.niche)?.label
                      }</div>
                      <div><strong>Language:</strong> {
                        languages.find(l => l.code === formData.language)?.name
                      }</div>
                      <div><strong>Voice:</strong> {
                        voiceOptions.find(v => v.id === formData.voicePreference)?.name
                      }</div>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Navigation */}
              <div className="px-6 pb-6">
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0 || currentStep === steps.length - 1}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>

                  {currentStep < steps.length - 2 && (
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}

                  {currentStep === steps.length - 2 && (
                    <Button
                      onClick={handleSubmit}
                      disabled={!isStepValid() || isLoading}
                      className="flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          Complete Setup
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  )}

                  {currentStep === steps.length - 1 && (
                    <Button onClick={() => router.push('/dashboard')}>
                      Go to Dashboard
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
