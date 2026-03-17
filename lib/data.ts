import { db } from './db'

// ─── Administratori ──────────────────────────────────────────────────────────

export async function getAdministrators() {
  return db.storeAdministrator.findMany({
    orderBy: [{ role: 'asc' }, { storeName: 'asc' }],
  })
}

export async function getAdministratorByStoreId(storeId: number) {
  return db.storeAdministrator.findUnique({ where: { storeId } })
}

export async function createAdministrator(data: {
  storeName: string
  user: string
  password: string
  role?: 'SUPER_ADMIN' | 'STORE_ADMIN'
}) {
  return db.storeAdministrator.create({
    data: {
      storeName: data.storeName,
      user: data.user,
      password: data.password,
      role: data.role ?? 'STORE_ADMIN',
    },
  })
}

export async function updateAdministrator(
  storeId: number,
  data: {
    storeName?: string
    user?: string
    password?: string
    role?: 'SUPER_ADMIN' | 'STORE_ADMIN'
  },
) {
  return db.storeAdministrator.update({
    where: { storeId },
    data,
  })
}

export async function deleteAdministrator(storeId: number) {
  return db.$transaction(async (tx) => {
    await tx.product.deleteMany({ where: { storeId } })
    await tx.category.deleteMany({ where: { storeId } })

    return tx.storeAdministrator.delete({ where: { storeId } })
  })
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(storeId: number) {
  return db.category.findMany({
    where: { storeId },
    orderBy: { name: 'asc' },
  })
}

export async function getCategoryById(storeId: number, id: string) {
  return db.category.findFirst({ where: { id, storeId } })
}

export async function getCategoryByName(storeId: number, name: string) {
  return db.category.findFirst({ where: { storeId, name } })
}

export async function createCategory(storeId: number, name: string) {
  return db.category.create({ data: { name, storeId } })
}

export async function updateCategory(storeId: number, id: string, name: string) {
  const category = await db.category.findFirst({ where: { id, storeId } })
  if (!category) throw new Error('Categoria nu a fost găsită.')
  return db.category.update({ where: { id }, data: { name } })
}

export async function deleteCategory(storeId: number, id: string) {
  const category = await db.category.findFirst({ where: { id, storeId } })
  if (!category) throw new Error('Categoria nu a fost găsită.')
  return db.category.delete({ where: { id } })
}

// ─── Products ─────────────────────────────────────────────────────────────────

export type ProductWithCategory = Awaited<ReturnType<typeof getProducts>>[number]

export async function getProducts(storeId: number) {
  return db.product.findMany({
    where: { storeId },
    orderBy: { name: 'asc' },
    include: { category: true },
  })
}

export async function getProductById(storeId: number, id: string) {
  return db.product.findFirst({
    where: { id, storeId },
    include: { category: true },
  })
}

export async function getProductByCode(storeId: number, code: string) {
  return db.product.findUnique({
    where: { storeId_code: { storeId, code } },
    include: { category: true },
  })
}

export async function createProduct(storeId: number, data: {
  code: string
  name: string
  measureUnit: string
  stock: number
  categoryId?: string | null
}) {
  return db.product.create({
    data: {
      ...data,
      storeId,
    },
  })
}

export async function updateProduct(
  storeId: number,
  id: string,
  data: {
    code?: string
    name?: string
    measureUnit?: string
    stock?: number
    categoryId?: string | null
  },
) {
  const product = await db.product.findFirst({ where: { id, storeId } })
  if (!product) throw new Error('Produsul nu a fost găsit.')
  return db.product.update({ where: { id }, data })
}

export async function deleteProduct(storeId: number, id: string) {
  const product = await db.product.findFirst({ where: { id, storeId } })
  if (!product) throw new Error('Produsul nu a fost găsit.')
  return db.product.delete({ where: { id } })
}

export async function decreaseStock(storeId: number, id: string, quantity: number) {
  return db.$transaction(async (tx) => {
    const product = await tx.product.findFirst({ where: { id, storeId } })
    if (!product) throw new Error('Produs negăsit')
    if (product.stock < quantity) throw new Error('Stoc insuficient')

    return tx.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    })
  })
}
