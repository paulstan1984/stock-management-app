import { NextResponse } from 'next/server'
import { createReadStream, statSync } from 'node:fs'
import { basename } from 'node:path'
import { Readable } from 'node:stream'
import { requireSuperAdmin } from '@/lib/auth'
import { getDatabasePath } from '@/lib/db-path'

export async function GET() {
  await requireSuperAdmin()

  const dbPath = getDatabasePath()

  let stat: ReturnType<typeof statSync>
  try {
    stat = statSync(dbPath)
  } catch {
    return NextResponse.json({ error: 'Fișierul bazei de date nu a fost găsit' }, { status: 404 })
  }

  const fileName = basename(dbPath)
  const stream = createReadStream(dbPath)
  const webStream = Readable.toWeb(stream) as ReadableStream<Uint8Array>

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': String(stat.size),
    },
  })
}
