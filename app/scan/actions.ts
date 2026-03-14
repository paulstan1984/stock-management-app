'use server'

import { revalidatePath } from 'next/cache'
import { decreaseStock } from '@/lib/data'

export async function decreaseStockAction(
  productId: string,
  quantity: number,
): Promise<void> {
  if (!productId || quantity <= 0) throw new Error('Date invalide.')
  await decreaseStock(productId, quantity)
  revalidatePath('/scan')
  revalidatePath('/admin/products')
}
