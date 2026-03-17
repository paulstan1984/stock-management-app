'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createCategory, updateCategory, deleteCategory } from '@/lib/data'
import { requireStoreAdmin } from '@/lib/auth'

export async function createCategoryAction(formData: FormData) {
  const session = await requireStoreAdmin()
  const name = (formData.get('name') as string).trim()
  if (!name) return
  await createCategory(session.storeId, name)
  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function updateCategoryAction(formData: FormData) {
  const session = await requireStoreAdmin()
  const id = formData.get('id') as string
  const name = (formData.get('name') as string).trim()
  if (!name) return
  await updateCategory(session.storeId, id, name)
  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function deleteCategoryAction(formData: FormData) {
  const session = await requireStoreAdmin()
  const id = formData.get('id') as string
  await deleteCategory(session.storeId, id)
  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}
