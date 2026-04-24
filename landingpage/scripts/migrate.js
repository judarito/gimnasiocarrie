import 'dotenv/config'
import { runMigrations } from '../server/repository.js'
import { databaseUrl } from '../server/db.js'

async function migrate() {
  console.log(`Running migrations on ${databaseUrl}...`)
  await runMigrations()
  console.log('Migration completed successfully!')
}

migrate().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
