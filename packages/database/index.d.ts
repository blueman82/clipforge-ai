import { PrismaClient } from '@prisma/client'

export { PrismaClient }
export const prisma: PrismaClient

declare global {
  var prisma: PrismaClient | undefined
}