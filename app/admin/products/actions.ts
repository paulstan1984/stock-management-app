'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createCategory,
  createProduct,
  deleteProduct,
  getCategoryById,
  getCategoryByName,
  getProductByCode,
  getProductById,
  updateProduct,
} from '@/lib/data'
import { requireStoreAdmin } from '@/lib/auth'

function getRequiredString(formData: FormData, key: string) {
  return ((formData.get(key) as string) ?? '').trim()
}

function parseCsvLine(line: string) {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

export async function createProductAction(formData: FormData) {
  const session = await requireStoreAdmin()
  const code = getRequiredString(formData, 'code')
  const name = getRequiredString(formData, 'name')
  const measureUnit = getRequiredString(formData, 'measureUnit')
  const stock = parseFloat(formData.get('stock') as string) || 0
  const categoryId = (formData.get('categoryId') as string) || null

  if (!code || !name || !measureUnit) {
    redirect('/admin/products/new?error=1')
  }

  const existing = await getProductByCode(session.storeId, code)
  if (existing) {
    redirect('/admin/products/new?error=cod-duplicat')
  }

  if (categoryId) {
    const category = await getCategoryById(session.storeId, categoryId)
    if (!category) {
      redirect('/admin/products/new?error=categorie-invalida')
    }
  }

  await createProduct(session.storeId, { code, name, measureUnit, stock, categoryId })
  revalidatePath('/admin/products')
  revalidatePath('/scan')
  redirect('/admin/products')
}

export async function updateProductAction(formData: FormData) {
  const session = await requireStoreAdmin()
  const id = formData.get('id') as string
  const code = getRequiredString(formData, 'code')
  const name = getRequiredString(formData, 'name')
  const measureUnit = getRequiredString(formData, 'measureUnit')
  const stock = parseFloat(formData.get('stock') as string) || 0
  const categoryId = (formData.get('categoryId') as string) || null

  if (!id || !code || !name || !measureUnit) {
    redirect('/admin/products?error=1')
  }

  const product = await getProductById(session.storeId, id)
  if (!product) {
    redirect('/admin/products?error=produs-negasit')
  }

  const existing = await getProductByCode(session.storeId, code)
  if (existing && existing.id !== id) {
    redirect(`/admin/products/${id}?error=cod-duplicat`)
  }

  if (categoryId) {
    const category = await getCategoryById(session.storeId, categoryId)
    if (!category) {
      redirect(`/admin/products/${id}?error=categorie-invalida`)
    }
  }

  await updateProduct(session.storeId, id, {
    code,
    name,
    measureUnit,
    stock,
    categoryId,
  })
  revalidatePath('/admin/products')
  revalidatePath('/scan')
  redirect('/admin/products')
}

export async function deleteProductAction(formData: FormData) {
  const session = await requireStoreAdmin()
  const id = formData.get('id') as string
  if (!id) {
    redirect('/admin/products?error=produs-negasit')
  }

  await deleteProduct(session.storeId, id)
  revalidatePath('/admin/products')
  revalidatePath('/scan')
  redirect('/admin/products')
}

export async function importProductsAction(formData: FormData) {
  const session = await requireStoreAdmin()
  const file = formData.get('file') as File | null

  if (!file) {
    redirect('/admin/products?import=fail')
  }

  const content = await file.text()
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length < 2) {
    redirect('/admin/products?import=gol')
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase())
  const expected = ['code', 'name', 'measureunit', 'stock', 'category']
  const hasExpectedHeaders = expected.every((header) => headers.includes(header))

  if (!hasExpectedHeaders) {
    redirect('/admin/products?import=header-invalid')
  }

  let created = 0
  let updated = 0
  let failed = 0

  for (const row of lines.slice(1)) {
    const cells = parseCsvLine(row)
    const rowData = Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? '']))

    const code = rowData.code?.trim()
    const name = rowData.name?.trim()
    const measureUnit = rowData.measureunit?.trim()
    const stock = Number.parseFloat(rowData.stock)
    const categoryName = rowData.category?.trim()

    if (!code || !name || !measureUnit || Number.isNaN(stock) || stock < 0) {
      failed += 1
      continue
    }

    try {
      let categoryId: string | null = null
      if (categoryName) {
        const existingCategory = await getCategoryByName(session.storeId, categoryName)
        if (existingCategory) {
          categoryId = existingCategory.id
        } else {
          const category = await createCategory(session.storeId, categoryName)
          categoryId = category.id
        }
      }

      const existingProduct = await getProductByCode(session.storeId, code)

      if (existingProduct) {
        await updateProduct(session.storeId, existingProduct.id, { stock })
        updated += 1
      } else {
        await createProduct(session.storeId, {
          code,
          name,
          measureUnit,
          stock,
          categoryId,
        })
        created += 1
      }
    } catch {
      failed += 1
    }
  }

  revalidatePath('/admin/products')
  revalidatePath('/scan')
  redirect(`/admin/products?import=ok&created=${created}&updated=${updated}&failed=${failed}`)
}
