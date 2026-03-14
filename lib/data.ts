import { db } from './db'

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories() {
  return db.category.findMany({ orderBy: { name: 'asc' } })
}

export async function getCategoryById(id: string) {
  return db.category.findUnique({ where: { id } })
}

export async function createCategory(name: string) {
  return db.category.create({ data: { name } })
}

export async function updateCategory(id: string, name: string) {
  return db.category.update({ where: { id }, data: { name } })
}

export async function deleteCategory(id: string) {
  return db.category.delete({ where: { id } })
}

// ─── Products ─────────────────────────────────────────────────────────────────

export type ProductWithCategory = Awaited<ReturnType<typeof getProducts>>[number]

export async function getProducts() {
  return db.product.findMany({
    orderBy: { name: 'asc' },
    include: { category: true },
  })
}

export async function getProductById(id: string) {
  return db.product.findUnique({ where: { id }, include: { category: true } })
}

export async function getProductByCode(code: string) {
  return db.product.findUnique({ where: { code }, include: { category: true } })
}

export async function createProduct(data: {
  code: string
  name: string
  measureUnit: string
  stock: number
  categoryId?: string | null
}) {
  return db.product.create({ data })
}

export async function updateProduct(
  id: string,
  data: {
    code?: string
    name?: string
    measureUnit?: string
    stock?: number
    categoryId?: string | null
  },
) {
  return db.product.update({ where: { id }, data })
}

export async function deleteProduct(id: string) {
  return db.product.delete({ where: { id } })
}

export async function decreaseStock(id: string, quantity: number) {
  return db.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id } })
    if (!product) throw new Error('Produs negăsit')
    if (product.stock < quantity) throw new Error('Stoc insuficient')
    return tx.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    })
  })
}
