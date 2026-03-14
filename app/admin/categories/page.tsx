export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getCategories } from '@/lib/data'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categorii</h1>
        <Link
          href="/admin/categories/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Adaugă
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-gray-500">Nu există categorii.</p>
      ) : (
        <ul className="divide-y divide-gray-200 bg-white rounded-xl shadow-sm border border-gray-100">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-gray-800">{cat.name}</span>
              <Link
                href={`/admin/categories/${cat.id}`}
                className="text-sm text-blue-600 hover:underline"
              >
                Editează
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
