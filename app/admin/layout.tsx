import Link from 'next/link'
import { logoutAction } from './actions'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between shadow">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg tracking-tight">Gestiune Stoc</span>
          <Link href="/admin/products" className="text-sm hover:underline">
            Produse
          </Link>
          <Link href="/admin/categories" className="text-sm hover:underline">
            Categorii
          </Link>
          <Link href="/scan" className="text-sm hover:underline">
            Cumpărare
          </Link>
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
