import { Redis } from 'ioredis'

let redisInstance: Redis | null = null

// Redis connection configuration
function createRedisConnection() {
  // Skip Redis connection during build time
  if (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL && !process.env.REDIS_HOST) {
    console.log('Skipping Redis connection - no Redis configuration found')
    return null
  }

  if (process.env.REDIS_URL) {
    // Use Redis URL if provided (for services like Upstash, Railway, etc.)
    return new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
    })
  }

  // Use individual config options
  const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  }

  return new Redis(redisConfig)
}

// Lazy Redis getter
export function getRedis(): Redis | null {
  if (redisInstance === null) {
    redisInstance = createRedisConnection()
    
    if (redisInstance) {
      // Handle connection events
      redisInstance.on('connect', () => {
        console.log('Redis connected successfully')
      })

      redisInstance.on('error', (err) => {
        console.error('Redis connection error:', err)
      })

      redisInstance.on('ready', () => {
        console.log('Redis is ready for operations')
      })

      redisInstance.on('close', () => {
        console.log('Redis connection closed')
      })

      // Graceful shutdown
      process.on('SIGTERM', () => {
        if (redisInstance) redisInstance.disconnect()
      })

      process.on('SIGINT', () => {
        if (redisInstance) redisInstance.disconnect()
      })
    }
  }
  
  return redisInstance
}

// Backward compatibility
export const redis = getRedis()