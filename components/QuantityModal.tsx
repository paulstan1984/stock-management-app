'use client'

import { useState } from 'react'

type Product = { id: string; name: string; measureUnit: string; stock: number }

interface Props {
  product: Product
  onConfirm: (quantity: number) => Promise<void>
  onClose: () => void
}

export function QuantityModal({ product, onConfirm, onClose }: Props) {
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const q = parseFloat(quantity)
    if (isNaN(q) || q <= 0) {
      setError('Introduceți o cantitate validă.')
      return
    }
    if (q > product.stock) {
      setError(`Stoc disponibil: ${product.stock} ${product.measureUnit}`)
      return
    }
    setLoading(true)
    try {
      await onConfirm(q)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Eroare la actualizarea stocului.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h2>
        <p className="text-sm text-gray-500 mb-4">
          Stoc curent: {product.stock} {product.measureUnit}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantitate ({product.measureUnit})
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0.001"
              step="any"
              required
              autoFocus
              placeholder="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-xl text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading ? 'Se procesează...' : 'Confirmă'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 hover:bg-gray-50 font-medium py-2.5 rounded-lg transition-colors"
            >
              Anulează
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
