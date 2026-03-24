import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { getDatabasePath } from './db-path'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: getDatabasePath() })
  return new PrismaClient({ adapter })
}

export const db: PrismaClient = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
