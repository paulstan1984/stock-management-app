'use server'

import { redirect } from 'next/navigation'
import { getSession, md5Hash } from '@/lib/auth'
import { db } from '@/lib/db'

export async function loginAction(formData: FormData) {
  const username = ((formData.get('username') as string) ?? '').trim()
  const password = ((formData.get('password') as string) ?? '').trim()

  if (!username || !password) {
    redirect('/login?error=1')
  }

  const admin = await db.storeAdministrator.findUnique({
    where: { user: username },
  })

  if (!admin || admin.password !== md5Hash(password)) {
    redirect('/login?error=1')
  }

  const session = await getSession()
  session.isLoggedIn = true
  session.username = username
  session.role = admin.role
  session.storeId = admin.storeId
  await session.save()

  redirect('/admin/products')
}
