'use client'

import { useState } from 'react'
import Link from 'next/link'

type Product = {
  id: string
  code: string
  name: string
  measureUnit: string
  stock: number
  category: { id: string; name: string } | null
}

interface Props {
  products: Product[]
}

export function ProductList({ products }: Props) {
  const [search, setSearch] = useState('')

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <input
        type="text"
        placeholder="Căutare produse..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />

      {filtered.length === 0 ? (
        <p className="text-gray-500">
          {search ? `Niciun produs găsit pentru „${search}".` : 'Nu există produse.'}
        </p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Cod</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Nume</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">U.M.</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Stoc</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Categorie</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-gray-500">{p.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.measureUnit}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{p.stock}</td>
                  <td className="px-4 py-3 text-gray-500">{p.category?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editează
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
