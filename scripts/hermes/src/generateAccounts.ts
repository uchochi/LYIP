import { writeFileSync } from 'node:fs'
import { allPersonas } from './personas.js'

const accounts = allPersonas.map(p => ({
  email: p.email,
  password: p.password,
  name: p.name,
  role: p.role,
  type: p.type,
}))

writeFileSync(new URL('../accounts.json', import.meta.url).pathname, JSON.stringify(accounts, null, 2), 'utf-8')
console.log(`Generated accounts.json with ${accounts.length} accounts`)
