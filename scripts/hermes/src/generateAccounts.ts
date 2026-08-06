import { writeFileSync } from 'node:fs'
import { allPersonas } from './personas.js'
import { config } from './config.js'

const accounts = allPersonas.map(p => ({
  email: p.email,
  password: p.password,
  name: p.name,
  role: p.role,
  type: p.type,
}))

writeFileSync(config.accountsPath, JSON.stringify(accounts, null, 2), 'utf-8')
console.log(`Generated accounts.json -> ${config.accountsPath} (${accounts.length} accounts)`)
