export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getAdministrators } from '@/lib/data'
import { requireSuperAdmin } from '@/lib/auth'

export default async function AdministratorsPage() {
  await requireSuperAdmin()
  const administrators = await getAdministrators()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Administratori</h1>
        <Link
          href="/admin/administrators/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + Adaugă
        </Link>
      </div>

      {administrators.length === 0 ? (
        <p className="text-gray-500">Nu există administratori definiți.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">StoreId</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Magazin</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Utilizator</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Rol</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {administrators.map((admin) => (
                <tr key={admin.storeId}>
                  <td className="px-4 py-3 font-mono text-gray-500">{admin.storeId}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{admin.storeName}</td>
                  <td className="px-4 py-3 text-gray-700">{admin.user}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {admin.role === 'SUPER_ADMIN' ? 'Super admin' : 'Administrator magazin'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/administrators/${admin.storeId}`}
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
