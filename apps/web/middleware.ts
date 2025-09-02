import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Redis for rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Create rate limiters for different endpoints
const rateLimiters = {
  // General API rate limit: 100 requests per minute
  api: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
  }),
  // Auth rate limit: 10 requests per minute
  auth: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
  }),
  // Project creation rate limit: 5 per minute
  projectCreate: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: true,
  }),
  // Render start rate limit: 3 per minute
  renderStart: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(3, '1 m'),
    analytics: true,
  }),
}

async function handleRateLimit(request: NextRequest, limiter: any, identifier: string) {
  const { success, limit, reset, remaining } = await limiter.limit(identifier)
  
  const response = success 
    ? NextResponse.next() 
    : NextResponse.json(
        { error: 'Rate limit exceeded', resetTime: reset },
        { status: 429 }
      )
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', limit.toString())
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', new Date(reset).toISOString())
  
  return response
}

function addSecurityHeaders(response: NextResponse) {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.vercel-insights.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http:",
      "media-src 'self' data: blob: https:",
      "connect-src 'self' https: wss:",
      "frame-src 'self' https:",
    ].join('; ')
  )
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // CORS headers for API routes
  if (response.url.includes('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXTAUTH_URL || '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  
  return response
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return request.ip || '127.0.0.1'
}

export default withAuth(
  async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const clientIP = getClientIP(request)
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 200 })
      return addSecurityHeaders(response)
    }
    
    // Apply rate limiting based on route
    let response: NextResponse
    
    if (pathname.startsWith('/api/auth')) {
      response = await handleRateLimit(request, rateLimiters.auth, `auth_${clientIP}`)
    } else if (pathname === '/api/projects' && request.method === 'POST') {
      response = await handleRateLimit(request, rateLimiters.projectCreate, `project_create_${clientIP}`)
    } else if (pathname.includes('/api/projects') && pathname.includes('/render')) {
      response = await handleRateLimit(request, rateLimiters.renderStart, `render_${clientIP}`)
    } else if (pathname.startsWith('/api')) {
      response = await handleRateLimit(request, rateLimiters.api, `api_${clientIP}`)
    } else {
      response = NextResponse.next()
    }
    
    // Add security headers to all responses
    return addSecurityHeaders(response)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/pricing',
          '/affiliate', 
          '/blog',
          '/privacy',
          '/terms',
          '/cookies',
          '/templates',
          '/auth/signin',
          '/auth/signout', 
          '/auth/error',
          '/auth/verify-request'
        ]
        
        if (publicRoutes.includes(pathname)) {
          return true
        }
        
        // Admin routes require admin role
        if (pathname.startsWith('/admin')) {
          return token?.role === 'admin'
        }
        
        // Dashboard and API routes require authentication
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/api/')) {
          // Allow some API routes to be public
          const publicApiRoutes = [
            '/api/auth',
            '/api/stripe/webhook'
          ]
          
          if (publicApiRoutes.some(route => pathname.startsWith(route))) {
            return true
          }
          
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}