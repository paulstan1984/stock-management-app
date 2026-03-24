/**
 * Extracts the SQLite database file path from the DATABASE_URL environment variable.
 * Strips the "file:" prefix used in SQLite connection URLs.
 */
export function getDatabasePath(): string {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL environment variable is not set')
  return url.startsWith('file:') ? url.slice(5) : url
}
