import { createHash } from 'node:crypto'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

function md5(text) {
  return createHash('md5').update(text).digest('hex')
}

async function main() {
  const username = process.env.SUPER_ADMIN_USERNAME || process.env.ADMIN_USERNAME
  const password = process.env.SUPER_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD
  const storeName = process.env.SUPER_ADMIN_STORE_NAME || 'Platform'

  if (!username || !password) {
    throw new Error('Lipsesc variabilele SUPER_ADMIN_USERNAME/SUPER_ADMIN_PASSWORD sau fallback ADMIN_USERNAME/ADMIN_PASSWORD.')
  }

  await prisma.storeAdministrator.upsert({
    where: { user: username },
    update: {
      storeName,
      password: md5(password),
      role: 'SUPER_ADMIN',
    },
    create: {
      storeName,
      user: username,
      password: md5(password),
      role: 'SUPER_ADMIN',
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
