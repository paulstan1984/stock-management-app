import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DeleteButton } from '@/components/DeleteButton'
import { getAdministratorByStoreId } from '@/lib/data'
import { requireSuperAdmin } from '@/lib/auth'
import { deleteAdministratorAction, updateAdministratorAction } from '../actions'

interface Props {
  params: Promise<{ storeId: string }>
  searchParams: Promise<{ error?: string }>
}

export default async function EditAdministratorPage({ params, searchParams }: Props) {
  await requireSuperAdmin()
  const { storeId } = await params
  const { error } = await searchParams

  const parsedStoreId = Number.parseInt(storeId, 10)
  if (!parsedStoreId) notFound()

  const administrator = await getAdministratorByStoreId(parsedStoreId)
  if (!administrator) notFound()

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Editează administrator</h1>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error === 'auto-stergere'
            ? 'Nu îți poți șterge propriul cont de super admin.'
            : 'Actualizarea a eșuat. Verifică datele introduse.'}
        </p>
      )}

      <form action={updateAdministratorAction} className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <input type="hidden" name="storeId" value={administrator.storeId} />

        <div>
          <label htmlFor="storeName" className="mb-1 block text-sm font-medium text-gray-700">
            Nume magazin
          </label>
          <input
            id="storeName"
            name="storeName"
            type="text"
            required
            defaultValue={administrator.storeName}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="user" className="mb-1 block text-sm font-medium text-gray-700">
            Utilizator
          </label>
          <input
            id="user"
            name="user"
            type="text"
            required
            defaultValue={administrator.user}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Parolă nouă (opțional)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
            Rol
          </label>
          <select
            id="role"
            name="role"
            defaultValue={administrator.role}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="STORE_ADMIN">Administrator magazin</option>
            <option value="SUPER_ADMIN">Super admin</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Salvează
          </button>
          <Link
            href="/admin/administrators"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
          >
            Anulează
          </Link>
        </div>
      </form>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <form action={deleteAdministratorAction}>
          <input type="hidden" name="storeId" value={administrator.storeId} />
          <DeleteButton label="Șterge administratorul" />
        </form>
      </div>
    </div>
  )
}
