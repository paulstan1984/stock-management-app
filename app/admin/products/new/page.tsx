export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getCategories } from '@/lib/data'
import { createProductAction } from '../actions'

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Produs nou</h1>

      <form
        action={createProductAction}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4"
      >
        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Cod (barcode)
          </label>
          <input
            id="code"
            name="code"
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
          />
        </div>

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

        <div>
          <label htmlFor="measureUnit" className="block text-sm font-medium text-gray-700 mb-1">
            Unitate de măsură
          </label>
          <input
            id="measureUnit"
            name="measureUnit"
            type="text"
            required
            placeholder="kg, L, buc"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            Stoc
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="any"
            defaultValue="0"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
            Categorie
          </label>
          <select
            id="categoryId"
            name="categoryId"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">— fără categorie —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Salvează
          </button>
          <Link
            href="/admin/products"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Anulează
          </Link>
        </div>
      </form>
    </div>
  )
}
