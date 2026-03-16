const { createHash } = require('node:crypto')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

function md5(text) {
  return createHash('md5').update(text).digest('hex')
}

async function main() {
  const username = process.env.SUPER_ADMIN_USERNAME
  const password = process.env.SUPER_ADMIN_PASSWORD
  const storeName = process.env.SUPER_ADMIN_STORE_NAME || 'Platform'

  if (!username || !password) {
    throw new Error('Lipsesc variabilele SUPER_ADMIN_USERNAME sau SUPER_ADMIN_PASSWORD.')
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
