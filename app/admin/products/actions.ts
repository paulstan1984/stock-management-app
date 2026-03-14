'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createProduct, updateProduct, deleteProduct } from '@/lib/data'

export async function createProductAction(formData: FormData) {
  const code = (formData.get('code') as string).trim()
  const name = (formData.get('name') as string).trim()
  const measureUnit = (formData.get('measureUnit') as string).trim()
  const stock = parseFloat(formData.get('stock') as string) || 0
  const categoryId = (formData.get('categoryId') as string) || null

  if (!code || !name || !measureUnit) return

  await createProduct({ code, name, measureUnit, stock, categoryId })
  revalidatePath('/admin/products')
  revalidatePath('/scan')
  redirect('/admin/products')
}

export async function updateProductAction(formData: FormData) {
  const id = formData.get('id') as string
  const code = (formData.get('code') as string).trim()
  const name = (formData.get('name') as string).trim()
  const measureUnit = (formData.get('measureUnit') as string).trim()
  const stock = parseFloat(formData.get('stock') as string) || 0
  const categoryId = (formData.get('categoryId') as string) || null

  if (!code || !name || !measureUnit) return

  await updateProduct(id, { code, name, measureUnit, stock, categoryId })
  revalidatePath('/admin/products')
  revalidatePath('/scan')
  redirect('/admin/products')
}

export async function deleteProductAction(formData: FormData) {
  const id = formData.get('id') as string
  await deleteProduct(id)
  revalidatePath('/admin/products')
  revalidatePath('/scan')
  redirect('/admin/products')
}
