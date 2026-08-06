import { allPersonas } from './personas.js'
import { writeFileSync } from 'node:fs'
import { config } from './config.js'

const accounts = allPersonas.map(p => ({
  email: p.email,
  password: p.password,
  name: p.name,
  type: p.type,
  role: p.role,
}))

writeFileSync(config.accountsPath, JSON.stringify(accounts, null, 2))
console.log(`Regenerated accounts.json -> ${config.accountsPath} (${accounts.length} entries)`)
