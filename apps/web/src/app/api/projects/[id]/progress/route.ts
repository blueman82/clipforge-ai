import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const projectId = params.id

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        user: {
          email: session.user.email,
        },
      },
      select: {
        id: true,
        status: true,
        progress: true,
        title: true,
      },
    })

    if (!project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    // Set up Server-Sent Events
    const encoder = new TextEncoder()
    
    const stream = new ReadableStream({
      start(controller) {
        // Initial data
        const initialData = {
          type: 'progress',
          projectId: project.id,
          status: project.status,
          progress: project.progress,
          title: project.title,
          timestamp: Date.now(),
        }
        
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`)
        )

        // Set up polling for progress updates
        const interval = setInterval(async () => {
          try {
            const updatedProject = await prisma.project.findUnique({
              where: { id: projectId },
              select: {
                status: true,
                progress: true,
                exportUrl: true,
                thumbnailUrl: true,
              },
            })

            if (updatedProject) {
              const progressData = {
                type: 'progress',
                projectId,
                status: updatedProject.status,
                progress: updatedProject.progress,
                exportUrl: updatedProject.exportUrl,
                thumbnailUrl: updatedProject.thumbnailUrl,
                timestamp: Date.now(),
              }

              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify(progressData)}\n\n`)
              )

              // Close connection when processing is complete
              if (updatedProject.status === 'COMPLETED' || updatedProject.status === 'FAILED') {
                clearInterval(interval)
                controller.close()
              }
            }
          } catch (error) {
            console.error('SSE polling error:', error)
            const errorData = {
              type: 'error',
              projectId,
              error: 'Failed to fetch progress',
              timestamp: Date.now(),
            }
            
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(errorData)}\n\n`)
            )
          }
        }, 2000) // Poll every 2 seconds

        // Clean up on close
        req.signal.addEventListener('abort', () => {
          clearInterval(interval)
          controller.close()
        })
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    })
  } catch (error) {
    console.error('SSE route error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}