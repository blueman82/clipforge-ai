import { Redis } from 'ioredis'

// Redis connection configuration
function createRedisConnection() {
  if (process.env.REDIS_URL) {
    // Use Redis URL if provided (for services like Upstash, Railway, etc.)
    return new Redis(process.env.REDIS_URL, {
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    })
  }

  // Use individual config options
  const redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
  }

  return new Redis(redisConfig)
}

// Create Redis instance
export const redis = createRedisConnection()

// Handle connection events
redis.on('connect', () => {
  console.log('Redis connected successfully')
})

redis.on('error', (err) => {
  console.error('Redis connection error:', err)
})

redis.on('ready', () => {
  console.log('Redis is ready for operations')
})

redis.on('close', () => {
  console.log('Redis connection closed')
})

// Graceful shutdown
process.on('SIGTERM', () => {
  redis.disconnect()
})

process.on('SIGINT', () => {
  redis.disconnect()
})