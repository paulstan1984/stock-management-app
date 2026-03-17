import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { unsealData } from 'iron-session'
import type { SessionData } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
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

    if (pathname.startsWith('/admin/administrators') && session.role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin/products', request.url))
    }

    const storeAdminOnlyPath = pathname.startsWith('/admin/products')
      || pathname.startsWith('/admin/categories')
      || pathname.startsWith('/scan')

    if (storeAdminOnlyPath && session.role === 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/admin/administrators', request.url))
    }
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/scan/:path*'],
}
