import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductById, getCategories } from '@/lib/data'
import { requireStoreAdmin } from '@/lib/auth'
import { updateProductAction, deleteProductAction } from '../actions'
import { DeleteButton } from '@/components/DeleteButton'

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}

export default async function EditProductPage({ params, searchParams }: Props) {
  const session = await requireStoreAdmin()
  const { id } = await params
  const { error } = await searchParams
  const [product, categories] = await Promise.all([
    getProductById(session.storeId, id),
    getCategories(session.storeId),
  ])
  if (!product) notFound()

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editează produs</h1>

      {error === 'cod-duplicat' && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Există deja un alt produs cu acest cod în magazinul tău.
        </p>
      )}

      <form
        action={updateProductAction}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4"
      >
        <input type="hidden" name="id" value={product.id} />

        <div>
          <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
            Cod
          </label>
          <input
            id="code"
            name="code"
            type="text"
            required
            defaultValue={product.code}
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
            defaultValue={product.name}
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
            defaultValue={product.measureUnit}
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
            defaultValue={product.stock}
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
            defaultValue={product.categoryId ?? ''}
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

      <div className="mt-6 pt-6 border-t border-gray-200">
        <form action={deleteProductAction}>
          <input type="hidden" name="id" value={product.id} />
          <DeleteButton label="Șterge produsul" />
        </form>
      </div>
    </div>
  )
}
