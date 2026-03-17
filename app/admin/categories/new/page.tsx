import Link from 'next/link'
import { requireStoreAdmin } from '@/lib/auth'
import { createCategoryAction } from '../actions'

export default async function NewCategoryPage() {
  await requireStoreAdmin()

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Categorie nouă</h1>

      <form action={createCategoryAction} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nume
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Salvează
          </button>
          <Link
            href="/admin/categories"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Anulează
          </Link>
        </div>
      </form>
    </div>
  )
}
