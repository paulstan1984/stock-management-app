import Link from 'next/link'
import { getProducts } from '@/lib/data'
import { ProductList } from '@/components/ProductList'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produse</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Adaugă
        </Link>
      </div>

      <ProductList products={products} />
    </div>
  )
}
