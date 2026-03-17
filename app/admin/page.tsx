import { redirect } from 'next/navigation'
import { requireAdminSession } from '@/lib/auth'

export default async function AdminPage() {
  const session = await requireAdminSession()

  redirect(session.role === 'SUPER_ADMIN' ? '/admin/administrators' : '/admin/products')
}
