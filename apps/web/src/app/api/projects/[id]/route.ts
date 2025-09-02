import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@clipforge/database'
import { authOptions } from '@/lib/auth'

const updateProjectSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  script: z.string().optional(),
  voiceSettings: z.object({
    voiceId: z.string().optional(),
    speed: z.number().min(0.5).max(2).optional(),
    pitch: z.number().min(-20).max(20).optional(),
  }).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const project = await prisma.project.findUnique({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        template: true,
        script: true,
        voiceSettings: true,
        previewUrl: true,
        exportUrl: true,
        thumbnailUrl: true,
        progress: true,
        jobId: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateProjectSchema.parse(body)
    const { id } = await params

    const project = await prisma.project.findUnique({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Don't allow updates if project is processing
    if (project.status === 'PROCESSING') {
      return NextResponse.json(
        { error: 'Cannot update project while processing' },
        { status: 409 }
      )
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        template: true,
        script: true,
        voiceSettings: true,
        previewUrl: true,
        exportUrl: true,
        thumbnailUrl: true,
        progress: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to update project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const project = await prisma.project.findUnique({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Soft delete the project
    await prisma.project.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'DELETED',
      },
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Failed to delete project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}