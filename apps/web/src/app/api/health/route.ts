import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    // Check Redis connection (if available)
    let redisStatus = 'not configured'
    
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'healthy',
        redis: redisStatus,
        api: 'healthy'
      },
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0'
    }
    
    return NextResponse.json(health)
  } catch (error) {
    const health = {
      status: 'error',
      timestamp: new Date().toISOString(),
      services: {
        database: 'unhealthy',
        redis: 'unknown',
        api: 'degraded'
      },
      error: error instanceof Error ? error.message : 'Unknown error',
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0'
    }
    
    return NextResponse.json(health, { status: 503 })
  }
}

export async function HEAD() {
  // For simple health checks that only need status code
  try {
    await prisma.$queryRaw`SELECT 1`
    return new NextResponse(null, { status: 200 })
  } catch (error) {
    return new NextResponse(null, { status: 503 })
  }
}