import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const onboardingSchema = z.object({
  niche: z.string().min(1, 'Please select a niche'),
  customNiche: z.string().optional(),
  language: z.string().min(1, 'Please select a language'),
  voicePreference: z.string().min(1, 'Please select a voice preference'),
  additionalNotes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = onboardingSchema.parse(body)

    // Prepare voice preferences JSON
    const voicePrefs = {
      preference: validatedData.voicePreference,
      additionalNotes: validatedData.additionalNotes || null,
    }

    // Update user profile with onboarding data
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        niche: validatedData.niche === 'other' ? validatedData.customNiche : validatedData.niche,
        language: validatedData.language,
        voicePrefs: voicePrefs,
      },
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        niche: updatedUser.niche,
        language: updatedUser.language,
        voicePrefs: updatedUser.voicePrefs,
      },
    })
  } catch (error) {
    console.error('Onboarding API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}