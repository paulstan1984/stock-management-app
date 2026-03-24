import Link from 'next/link'
import { logoutAction } from './actions'
import { requireAdminSession } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdminSession()
  const isSuperAdmin = session.role === 'SUPER_ADMIN'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
          <span className="font-bold text-lg tracking-tight">Gestiune Stoc</span>
          {!isSuperAdmin && (
            <>
              <Link href="/admin/products" className="text-sm hover:underline">
                Produse
              </Link>
              <Link href="/admin/categories" className="text-sm hover:underline">
                Categorii
              </Link>
              <Link href="/scan" className="text-sm hover:underline">
                Cumpărare
              </Link>
            </>
          )}
          {isSuperAdmin && (
            <Link href="/admin/administrators" className="text-sm hover:underline">
              Administratori
            </Link>
          )}
          {isSuperAdmin && (
            <a
              href="/api/admin/download-db"
              className="text-sm border border-white/40 rounded-md px-3 py-1 hover:bg-white/10 transition-colors"
            >
              Descarcă DB
            </a>
          )}
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm border border-white/40 rounded-md px-3 py-1 hover:bg-white/10 transition-colors"
          >
            Deconectare
          </button>
        </form>
      </nav>

      <main className="flex-1 p-6 max-w-5xl w-full mx-auto">{children}</main>
    </div>
  )
}
