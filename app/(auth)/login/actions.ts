'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/auth'
import { authConfig } from '@/config/auth'

export async function loginAction(formData: FormData) {
  const username = (formData.get('username') as string).trim()
  const password = formData.get('password') as string

  if (username !== authConfig.username || password !== authConfig.password) {
    redirect('/login?error=1')
  }

  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  session.isLoggedIn = true
  session.username = username
  await session.save()

  redirect('/admin/products')
}
