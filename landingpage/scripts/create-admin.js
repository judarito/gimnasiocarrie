import 'dotenv/config'
import { hashPassword } from '../server/auth.js'
import { databaseUrl } from '../server/db.js'
import { createUser, findUserByEmail, runMigrations } from '../server/repository.js'

const args = process.argv.slice(2)

function getArg(name) {
  const index = args.indexOf(`--${name}`)
  return index >= 0 ? args[index + 1] : ''
}

async function main() {
  const email = (getArg('email') || process.env.ADMIN_EMAIL || '').toLowerCase().trim()
  const password = getArg('password') || process.env.ADMIN_PASSWORD || ''

  if (!email || !password) {
    throw new Error('Usa --email y --password o define ADMIN_EMAIL y ADMIN_PASSWORD.')
  }

  await runMigrations()

  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    console.log(`The admin user ${email} already exists in ${databaseUrl}.`)
    return
  }

  const passwordHash = await hashPassword(password)
  await createUser({ email, passwordHash, role: 'admin' })
  console.log(`Admin user ${email} created successfully in ${databaseUrl}.`)
}

main().catch((error) => {
  console.error('Could not create the admin user:', error.message)
  process.exit(1)
})
