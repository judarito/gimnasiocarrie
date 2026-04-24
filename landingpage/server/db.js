import { createClient } from '@libsql/client'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const localDbPath = path.resolve(__dirname, '../data/local.db')

const url =
  process.env.TURSO_DATABASE_URL ||
  process.env.VITE_TURSO_DATABASE_URL ||
  `file:${localDbPath}`

const authToken = process.env.TURSO_AUTH_TOKEN || process.env.VITE_TURSO_AUTH_TOKEN

const config = authToken ? { url, authToken } : { url }

if (url.startsWith('file:')) {
  fs.mkdirSync(path.dirname(localDbPath), { recursive: true })
}

export const db = createClient(config)
export const isRemoteDatabase = !url.startsWith('file:')
export const databaseUrl = url
