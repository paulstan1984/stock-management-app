'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/auth'

export async function logoutAction() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  session.destroy()
  redirect('/login')
}
