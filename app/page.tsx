export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, type SessionData } from '@/lib/auth'

export default async function Home() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  if (session.isLoggedIn) {
    redirect('/admin/products')
  }
  redirect('/login')
}
