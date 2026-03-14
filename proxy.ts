import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { unsealData } from 'iron-session'
import type { SessionData } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const cookieValue = request.cookies.get('stock_session')?.value

  if (!cookieValue) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const session = await unsealData<SessionData>(cookieValue, {
      password: process.env.SESSION_SECRET!,
    })
    if (!session.isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/scan/:path*'],
}
