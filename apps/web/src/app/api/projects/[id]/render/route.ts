import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { Queue } from 'bullmq'
import { z } from 'zod'
import { prisma } from '@clipforge/database'
import { authOptions } from '@/lib/auth'
import { getRedis } from '@/lib/redis'

// Initialize job queues conditionally
function createQueues() {
  const redis = getRedis()
  if (!redis) return null
  
  return {
    scriptGeneration: new Queue('script-generation', { connection: redis }),
    ttsGeneration: new Queue('tts-generation', { connection: redis }),
    assetSelection: new Queue('asset-selection', { connection: redis }),
    videoComposition: new Queue('video-composition', { connection: redis }),
    videoExport: new Queue('video-export', { connection: redis }),
  }
}

const queues = createQueues()

const renderSchema = z.object({
  quality: z.enum(['540p', '1080p', '4K']).optional().default('540p'),
  watermark: z.boolean().optional().default(true),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = renderSchema.parse(body)
    const { id } = await params

    // Get project and validate ownership
    const project = await prisma.project.findUnique({
      where: {
        id,
        userId: session.user.id,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            credits: true,
            subscriptionStatus: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if project can be rendered
    if (project.status === 'PROCESSING') {
      return NextResponse.json(
        { error: 'Project is already being processed' },
        { status: 409 }
      )
    }

    if (!project.script || !project.template) {
      return NextResponse.json(
        { error: 'Project must have script and template to render' },
        { status: 400 }
      )
    }

    // Check credits for export
    const requiredCredits = validatedData.quality === '4K' ? 5 : validatedData.quality === '1080p' ? 3 : 1
    
    if (validatedData.quality !== '540p' && project.user.credits < requiredCredits) {
      return NextResponse.json(
        { error: `Insufficient credits. Need ${requiredCredits} credits for ${validatedData.quality} export` },
        { status: 402 }
      )
    }

    // Check quality permissions
    if (validatedData.quality === '4K' && project.user.subscriptionStatus !== 'active') {
      return NextResponse.json(
        { error: '4K rendering requires active subscription' },
        { status: 403 }
      )
    }

    // Start rendering pipeline
    const jobData = {
      projectId: project.id,
      userId: session.user.id,
      script: project.script,
      template: project.template,
      voiceSettings: project.voiceSettings || {},
      quality: validatedData.quality,
      watermark: validatedData.watermark,
    }

    // Add job to script generation queue
    if (!queues) {
      return NextResponse.json(
        { error: 'Redis not available - job queues disabled' },
        { status: 503 }
      )
    }
    
    const scriptJob = await queues.scriptGeneration.add(
      `script-${project.id}`,
      jobData,
      {
        delay: 0,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 5,
        removeOnFail: 5,
      }
    )

    // Update project status
    await prisma.project.update({
      where: { id: project.id },
      data: {
        status: 'PROCESSING',
        jobId: scriptJob.id,
        progress: 0,
      },
    })

    return NextResponse.json({
      message: 'Rendering started successfully',
      jobId: scriptJob.id,
      estimatedTime: '5-10 minutes',
      quality: validatedData.quality,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to start rendering:', error)
    return NextResponse.json(
      { error: 'Failed to start rendering' },
      { status: 500 }
    )
  }
}

// Get rendering status
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
        status: true,
        progress: true,
        jobId: true,
        previewUrl: true,
        exportUrl: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    let jobStatus = null
    if (project.jobId && queues) {
      try {
        // Try to get job status from any queue
        for (const queue of Object.values(queues)) {
          const job = await queue.getJob(project.jobId)
          if (job) {
            jobStatus = {
              id: job.id,
              name: job.name,
              status: await job.getState(),
              progress: job.progress,
              data: job.data,
              failedReason: job.failedReason,
            }
            break
          }
        }
      } catch (error) {
        console.error('Failed to get job status:', error)
      }
    }

    return NextResponse.json({
      project: {
        id: project.id,
        status: project.status,
        progress: project.progress,
        previewUrl: project.previewUrl,
        exportUrl: project.exportUrl,
      },
      job: jobStatus,
    })
  } catch (error) {
    console.error('Failed to get rendering status:', error)
    return NextResponse.json(
      { error: 'Failed to get rendering status' },
      { status: 500 }
    )
  }
}