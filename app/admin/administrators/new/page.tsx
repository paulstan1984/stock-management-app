import Link from 'next/link'
import { requireSuperAdmin } from '@/lib/auth'
import { createAdministratorAction } from '../actions'

interface Props {
  searchParams: Promise<{ error?: string }>
}

export default async function NewAdministratorPage({ searchParams }: Props) {
  await requireSuperAdmin()
  const { error } = await searchParams

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Administrator nou</h1>

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error === 'user-duplicat'
            ? 'Există deja un administrator cu acest utilizator.'
            : 'Completează toate câmpurile obligatorii.'}
        </p>
      )}

      <form action={createAdministratorAction} className="space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="storeName" className="mb-1 block text-sm font-medium text-gray-700">
            Nume magazin
          </label>
          <input
            id="storeName"
            name="storeName"
            type="text"
            required
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Parolă
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
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
            defaultValue="STORE_ADMIN"
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
    </div>
  )
}
