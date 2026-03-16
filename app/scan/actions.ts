'use server'

import { revalidatePath } from 'next/cache'
import { decreaseStock } from '@/lib/data'
import { requireAdminSession } from '@/lib/auth'

export async function decreaseStockAction(
  productId: string,
  quantity: number,
): Promise<void> {
  const session = await requireAdminSession()
  if (!productId || quantity <= 0) throw new Error('Date invalide.')
  await decreaseStock(session.storeId, productId, quantity)
  revalidatePath('/scan')
  revalidatePath('/admin/products')
}
