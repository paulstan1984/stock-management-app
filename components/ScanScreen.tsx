'use client'

import { useState, useCallback } from 'react'
import { BarcodeScanner } from '@/components/BarcodeScanner'
import { QuantityModal } from '@/components/QuantityModal'
import { decreaseStockAction } from '@/app/scan/actions'

type Product = {
  id: string
  code: string
  name: string
  measureUnit: string
  stock: number
  category: { id: string; name: string } | null
}

type SuccessMessage = { type: 'success' | 'error'; text: string }

interface Props {
  products: Product[]
}

export function ScanScreen({ products: initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts)
  const [selected, setSelected] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [flash, setFlash] = useState<SuccessMessage | null>(null)

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleScan = useCallback(
    (code: string) => {
      const product = products.find((p) => p.code === code)
      setShowScanner(false)
      if (product) {
        setSelected(product)
      } else {
        setFlash({ type: 'error', text: `Cod „${code}" negăsit.` })
      }
    },
    [products],
  )

  const handleConfirm = async (quantity: number) => {
    if (!selected) return
    await decreaseStockAction(selected.id, quantity)
    // Update local stock immediately for responsive UX
    setProducts((prev) =>
      prev.map((p) =>
        p.id === selected.id ? { ...p, stock: p.stock - quantity } : p,
      ),
    )
    setFlash({
      type: 'success',
      text: `${selected.name}: −${quantity} ${selected.measureUnit}`,
    })
    setSelected(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white px-4 py-3 flex items-center justify-between shadow">
        <h1 className="text-xl font-bold">Cumpărare</h1>
        <a href="/admin/products" className="text-sm hover:underline opacity-80">
          Admin
        </a>
      </header>

      <div className="flex-1 p-4 max-w-2xl w-full mx-auto space-y-4">
        {/* Flash message */}
        {flash && (
          <div
            className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium ${
              flash.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}
          >
            <span>{flash.text}</span>
            <button
              onClick={() => setFlash(null)}
              className="ml-3 font-bold opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scanner toggle */}
        <button
          onClick={() => setShowScanner((v) => !v)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
        >
          {showScanner ? '✕ Închide scanner' : '📷 Scanează cod de bare'}
        </button>

        {showScanner && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-4">
            <BarcodeScanner onScan={handleScan} />
          </div>
        )}

        {/* Search */}
        <input
          type="text"
          placeholder="Căutare produs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />

        {/* Product grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 pt-8">Niciun produs găsit.</p>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="bg-white border border-gray-200 rounded-xl p-3 text-left shadow-sm hover:border-blue-400 hover:bg-blue-50 active:scale-95 transition-all"
              >
                <div className="font-medium text-sm text-gray-900 leading-snug">
                  {p.name}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Stoc: {p.stock} {p.measureUnit}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quantity modal */}
      {selected && (
        <QuantityModal
          product={selected}
          onConfirm={handleConfirm}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
