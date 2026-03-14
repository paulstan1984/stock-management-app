import type { SessionOptions } from 'iron-session'

export interface SessionData {
  isLoggedIn: boolean
  username?: string
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
