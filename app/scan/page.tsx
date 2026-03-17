export const dynamic = 'force-dynamic'

import { getProducts } from '@/lib/data'
import { requireStoreAdmin } from '@/lib/auth'
import { ScanScreen } from '@/components/ScanScreen'

export default async function ScanPage() {
  const session = await requireStoreAdmin()
  const products = await getProducts(session.storeId)
  return <ScanScreen products={products} />
}
