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
                <th className="hidden md:table-cell text-left px-4 py-3 font-medium text-gray-500">Cod</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Nume</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">U.M.</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Stoc</th>
                <th className="hidden sm:table-cell text-left px-4 py-3 font-medium text-gray-500">Categorie</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="hidden md:table-cell px-4 py-3 font-mono text-gray-500">{p.code}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.measureUnit}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{p.stock}</td>
                  <td className="hidden sm:table-cell px-4 py-3 text-gray-500">{p.category?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2.5 py-1.5 text-blue-600 hover:bg-blue-50 md:border-0 md:px-0 md:py-0 md:text-blue-600 md:hover:underline"
                      aria-label={`Editează produsul ${p.name}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-4 w-4 md:hidden"
                      >
                        <path d="M3 17.25V21h3.75l11-11-3.75-3.75-11 11Zm17.71-10.04a1 1 0 0 0 0-1.42L18.21 3.29a1 1 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 2-1.66Z" />
                      </svg>
                      <span className="hidden md:inline">Editează</span>
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
