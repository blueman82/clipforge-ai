import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@clipforge/database'
import { authOptions } from '@/lib/auth'

const createProjectSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  template: z.object({
    id: z.string(),
    name: z.string(),
    aspectRatio: z.string(),
  }),
  script: z.string().optional(),
  voiceSettings: z.object({
    voiceId: z.string().optional(),
    speed: z.number().min(0.5).max(2).optional(),
    pitch: z.number().min(-20).max(20).optional(),
  }).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const skip = (page - 1) * limit

    const where = {
      userId: session.user.id,
      deletedAt: null,
      ...(status && { status: status as any }),
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          template: true,
          previewUrl: true,
          exportUrl: true,
          thumbnailUrl: true,
          progress: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.project.count({ where }),
    ])

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createProjectSchema.parse(body)

    // Check user credits for project creation
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    })

    if (!user || user.credits < 1) {
      return NextResponse.json(
        { error: 'Insufficient credits to create project' },
        { status: 402 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        template: validatedData.template,
        script: validatedData.script,
        voiceSettings: validatedData.voiceSettings,
        userId: session.user.id,
        status: 'DRAFT',
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        template: true,
        progress: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to create project:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}