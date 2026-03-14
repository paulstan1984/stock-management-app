'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createCategory, updateCategory, deleteCategory } from '@/lib/data'

export async function createCategoryAction(formData: FormData) {
  const name = (formData.get('name') as string).trim()
  if (!name) return
  await createCategory(name)
  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function updateCategoryAction(formData: FormData) {
  const id = formData.get('id') as string
  const name = (formData.get('name') as string).trim()
  if (!name) return
  await updateCategory(id, name)
  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}

export async function deleteCategoryAction(formData: FormData) {
  const id = formData.get('id') as string
  await deleteCategory(id)
  revalidatePath('/admin/categories')
  redirect('/admin/categories')
}
