'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  createAdministrator,
  deleteAdministrator,
  getAdministratorByStoreId,
  updateAdministrator,
} from '@/lib/data'
import { md5Hash, requireSuperAdmin } from '@/lib/auth'

function getString(formData: FormData, key: string) {
  return ((formData.get(key) as string) ?? '').trim()
}

export async function createAdministratorAction(formData: FormData) {
  await requireSuperAdmin()

  const storeName = getString(formData, 'storeName')
  const user = getString(formData, 'user')
  const password = getString(formData, 'password')
  const roleValue = getString(formData, 'role')
  const role = roleValue === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'STORE_ADMIN'

  if (!storeName || !user || !password) {
    redirect('/admin/administrators/new?error=campuri')
  }

  try {
    await createAdministrator({
      storeName,
      user,
      password: md5Hash(password),
      role,
    })
  } catch {
    redirect('/admin/administrators/new?error=user-duplicat')
  }

  revalidatePath('/admin/administrators')
  redirect('/admin/administrators')
}

export async function updateAdministratorAction(formData: FormData) {
  await requireSuperAdmin()

  const storeId = Number.parseInt(getString(formData, 'storeId'), 10)
  const storeName = getString(formData, 'storeName')
  const user = getString(formData, 'user')
  const password = getString(formData, 'password')
  const roleValue = getString(formData, 'role')
  const role = roleValue === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'STORE_ADMIN'

  if (!storeId || !storeName || !user) {
    redirect('/admin/administrators?error=campuri')
  }

  const data: {
    storeName: string
    user: string
    role: 'SUPER_ADMIN' | 'STORE_ADMIN'
    password?: string
  } = { storeName, user, role }

  if (password) {
    data.password = md5Hash(password)
  }

  try {
    await updateAdministrator(storeId, data)
  } catch {
    redirect(`/admin/administrators/${storeId}?error=user-duplicat`)
  }

  revalidatePath('/admin/administrators')
  redirect('/admin/administrators')
}

export async function deleteAdministratorAction(formData: FormData) {
  const session = await requireSuperAdmin()

  const storeId = Number.parseInt(getString(formData, 'storeId'), 10)
  if (!storeId) {
    redirect('/admin/administrators?error=invalid')
  }

  const admin = await getAdministratorByStoreId(storeId)
  if (!admin) {
    redirect('/admin/administrators?error=negasit')
  }

  if (admin.role === 'SUPER_ADMIN' && session.storeId === admin.storeId) {
    redirect(`/admin/administrators/${storeId}?error=auto-stergere`)
  }

  await deleteAdministrator(storeId)
  revalidatePath('/admin/administrators')
  redirect('/admin/administrators')
}
