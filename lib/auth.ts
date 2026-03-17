import type { SessionOptions } from 'iron-session'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { createHash } from 'node:crypto'
import { redirect } from 'next/navigation'

export type AdminRole = 'SUPER_ADMIN' | 'STORE_ADMIN'

export interface SessionData {
  isLoggedIn: boolean
  username?: string
  role?: AdminRole
  storeId?: number
}

export const sessionOptions: SessionOptions = {
  cookieName: 'stock_session',
  password: process.env.SESSION_SECRET!,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
}

export function md5Hash(value: string) {
  return createHash('md5').update(value).digest('hex')
}

export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

export async function requireAdminSession() {
  const session = await getSession()

  if (!session.isLoggedIn || !session.username || !session.storeId || !session.role) {
    redirect('/login')
  }

  return session as SessionData & {
    username: string
    role: AdminRole
    storeId: number
  }
}

export async function requireStoreAdmin() {
  const session = await requireAdminSession()
  if (session.role !== 'STORE_ADMIN') {
    redirect('/admin/administrators')
  }
  return session
}

export async function requireSuperAdmin() {
  const session = await requireAdminSession()
  if (session.role !== 'SUPER_ADMIN') {
    redirect('/admin/products')
  }
  return session
}
