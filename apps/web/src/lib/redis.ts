import { Redis } from 'ioredis'

// Redis connection configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  // Connection options
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  // For production, you might want to add more config
  ...(process.env.REDIS_URL && {
    // Parse Redis URL if provided (for services like Upstash)
    // Format: redis://username:password@host:port
  }),
}

// Create Redis instance
export const redis = new Redis(process.env.REDIS_URL || redisConfig)

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