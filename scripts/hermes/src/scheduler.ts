import { readFileSync } from 'node:fs'
import { config } from './config.js'
import type { Account } from './browser.js'

let accounts: Account[] = []
let typePools: Record<string, Account[]> = {}

export function loadAccounts(): Account[] {
  const raw = readFileSync(config.accountsPath, 'utf-8')
  accounts = JSON.parse(raw) as Account[]

  typePools = {}
  for (const acc of accounts) {
    if (!typePools[acc.type]) typePools[acc.type] = []
    typePools[acc.type].push(acc)
  }

  console.log(`Loaded ${accounts.length} accounts (${Object.keys(typePools).length} types)`)
  return accounts
}

export function pickAccount(): { account: Account; actionType: string } {
  const types = Object.keys(config.personaWeights)
  const weights = types.map(t => config.personaWeights[t])
  const totalWeight = weights.reduce((a, b) => a + b, 0)

  let rand = Math.random() * totalWeight
  let pickedType = types[0]

  for (let i = 0; i < types.length; i++) {
    rand -= weights[i]
    if (rand <= 0) {
      pickedType = types[i]
      break
    }
  }

  const pool = typePools[pickedType]
  if (!pool || pool.length === 0) {
    const fallback = accounts[Math.floor(Math.random() * accounts.length)]
    return { account: fallback, actionType: fallback.type }
  }

  const account = pool[Math.floor(Math.random() * pool.length)]
  return { account, actionType: pickedType }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function randomDelayMs(): number {
  const min = config.minDelayMinutes * 60 * 1000
  const max = config.maxDelayMinutes * 60 * 1000
  return Math.floor(Math.random() * (max - min) + min)
}
