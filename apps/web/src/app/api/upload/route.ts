import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'

const uploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileType: z.string().min(1).max(50),
  fileSize: z.number().min(1).max(100 * 1024 * 1024), // 100MB max
  uploadType: z.enum(['avatar', 'project-asset', 'temp']),
})

// Generate signed URL for S3 upload (placeholder for now)
async function generateSignedUrl(
  fileName: string,
  fileType: string,
  uploadType: string,
  userId: string
): Promise<{ uploadUrl: string; fileUrl: string }> {
  // For now, return mock URLs - replace with actual S3 implementation
  const timestamp = Date.now()
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  const key = `${uploadType}/${userId}/${timestamp}_${sanitizedFileName}`
  
  return {
    uploadUrl: `https://mock-s3-bucket.s3.amazonaws.com/${key}?signed=true`,
    fileUrl: `https://mock-s3-bucket.s3.amazonaws.com/${key}`,
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = uploadSchema.parse(body)

    // Validate file type based on upload type
    const allowedTypes: Record<string, string[]> = {
      avatar: ['image/jpeg', 'image/png', 'image/webp'],
      'project-asset': [
        'image/jpeg',
        'image/png', 
        'image/webp',
        'video/mp4',
        'video/webm',
        'audio/mp3',
        'audio/wav',
      ],
      temp: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'video/mp4',
        'video/webm',
        'audio/mp3',
        'audio/wav',
        'text/plain',
      ],
    }

    const allowed = allowedTypes[validatedData.uploadType] || []
    if (!allowed.includes(validatedData.fileType)) {
      return NextResponse.json(
        { error: `File type ${validatedData.fileType} not allowed for ${validatedData.uploadType}` },
        { status: 400 }
      )
    }

    // Generate signed upload URL
    const { uploadUrl, fileUrl } = await generateSignedUrl(
      validatedData.fileName,
      validatedData.fileType,
      validatedData.uploadType,
      session.user.id
    )

    return NextResponse.json({
      uploadUrl,
      fileUrl,
      expiresIn: 3600, // 1 hour
      maxSize: validatedData.fileSize,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Failed to generate upload URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}

// Handle upload completion callback
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { fileUrl, uploadType, metadata } = body

    // TODO: Store file metadata in database
    // await prisma.uploadedFile.create({
    //   data: {
    //     userId: session.user.id,
    //     fileUrl,
    //     uploadType,
    //     metadata,
    //     status: 'completed',
    //   },
    // })

    return NextResponse.json({
      message: 'Upload completed successfully',
      fileUrl,
    })
  } catch (error) {
    console.error('Failed to complete upload:', error)
    return NextResponse.json(
      { error: 'Failed to complete upload' },
      { status: 500 }
    )
  }
}