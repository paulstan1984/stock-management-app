import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/data'
import { getSession } from '@/lib/auth'

function csvEscape(value: string) {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replaceAll('"', '""')}"`
  }
  return value
}

export async function GET() {
  const session = await getSession()

  if (!session.isLoggedIn || !session.storeId || session.role !== 'STORE_ADMIN') {
    return new NextResponse('Neautorizat', { status: 401 })
  }

  const products = await getProducts(session.storeId)
  const header = 'code,name,measureUnit,stock,category'
  const rows = products.map((product) => {
    return [
      csvEscape(product.code),
      csvEscape(product.name),
      csvEscape(product.measureUnit),
      String(product.stock),
      csvEscape(product.category?.name ?? ''),
    ].join(',')
  })

  const csv = [header, ...rows].join('\n')

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="produse.csv"',
    },
  })
}
