export const dynamic = 'force-dynamic'

import { getProducts } from '@/lib/data'
import { requireAdminSession } from '@/lib/auth'
import { ScanScreen } from '@/components/ScanScreen'

export default async function ScanPage() {
  const session = await requireAdminSession()
  const products = await getProducts(session.storeId)
  return <ScanScreen products={products} />
}
