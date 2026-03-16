import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategoryById } from '@/lib/data'
import { requireAdminSession } from '@/lib/auth'
import { updateCategoryAction, deleteCategoryAction } from '../actions'
import { DeleteButton } from '@/components/DeleteButton'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: Props) {
  const session = await requireAdminSession()
  const { id } = await params
  const category = await getCategoryById(session.storeId, id)
  if (!category) notFound()

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editează categorie</h1>

      <form action={updateCategoryAction} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <input type="hidden" name="id" value={category.id} />

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nume
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={category.name}
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

      <div className="mt-6 pt-6 border-t border-gray-200">
        <form action={deleteCategoryAction}>
          <input type="hidden" name="id" value={category.id} />
          <DeleteButton label="Șterge categoria" />
        </form>
      </div>
    </div>
  )
}
