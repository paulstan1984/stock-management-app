export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getProducts } from '@/lib/data'
import { requireStoreAdmin } from '@/lib/auth'
import { importProductsAction } from './actions'
import { ProductList } from '@/components/ProductList'

interface Props {
  searchParams: Promise<{ import?: string; created?: string; updated?: string; failed?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const session = await requireStoreAdmin()
  const products = await getProducts(session.storeId)
  const params = await searchParams
  const imported = params.import === 'ok'
  const hasImportError = params.import && params.import !== 'ok'

  return (
    <div>
      <div className="flex flex-col gap-3 mb-6 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Produse</h1>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Adaugă
          </Link>
          <Link
            href="/admin/products/export"
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Export CSV
          </Link>
        </div>
      </div>

      <form action={importProductsAction} className="mb-4 flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 md:flex-row md:items-center">
        <input
          type="file"
          name="file"
          accept=".csv,text/csv"
          required
          className="text-sm"
        />
        <button
          type="submit"
          className="w-full md:w-auto border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Import CSV
        </button>
      </form>

      {imported && (
        <p className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          Import finalizat: create {params.created ?? '0'}, actualizate {params.updated ?? '0'}, erori {params.failed ?? '0'}.
        </p>
      )}

      {hasImportError && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Importul a eșuat. Verifică formatul CSV: code,name,measureUnit,stock,category.
        </p>
      )}

      <ProductList products={products} />
    </div>
  )
}
