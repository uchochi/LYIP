import { allPersonas } from './personas.js'
import { writeFileSync } from 'node:fs'

const accounts = allPersonas.map(p => ({
  email: p.email,
  password: p.password,
  name: p.name,
  type: p.type,
  role: p.role,
}))

writeFileSync(new URL('../accounts.json', import.meta.url).pathname, JSON.stringify(accounts, null, 2))
console.log(`Regenerated accounts.json with ${accounts.length} entries`)
