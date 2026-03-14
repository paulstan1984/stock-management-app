import { getProducts } from '@/lib/data'
import { ScanScreen } from '@/components/ScanScreen'

export default async function ScanPage() {
  const products = await getProducts()
  return <ScanScreen products={products} />
}
