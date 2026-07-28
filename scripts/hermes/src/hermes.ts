import { config } from './config.js'
import { createContext, closeAll, login } from './browser.js'
import { loadAccounts, pickAccount, sleep, randomDelayMs } from './scheduler.js'
import { actionMap } from './actions.js'
import type { Browser } from 'playwright'

let cycleCount = 0
let startTime = Date.now()

function elapsed(): string {
  const ms = Date.now() - startTime
  const mins = Math.floor(ms / 60000)
  const secs = Math.floor((ms % 60000) / 1000)
  return `${mins}m ${secs}s`
}

async function runCycle(): Promise<void> {
  cycleCount++
  const { account, actionType } = pickAccount()

  console.log(`\n[${elapsed()}] Cycle #${cycleCount} — ${actionType}: ${account.name} (${account.email})`)

  let browser: Browser | null = null

  try {
    const ctx = await createContext()
    browser = ctx.browser
    const { page } = ctx

    const ok = await login(page, account.email, account.password)
    if (!ok) {
      console.log(`  Skipping — login failed`)
      return
    }

    const action = actionMap[actionType]
    if (!action) {
      console.log(`  No action defined for type: ${actionType}`)
      return
    }

    await action(page, account)
  } catch (err) {
    console.error(`  Unhandled error:`, err instanceof Error ? err.message : err)
  } finally {
    if (browser) await closeAll(browser)
  }
}

async function main() {
  console.log('═══════════════════════════════════════════')
  console.log('  Hermes — Forum Engagement Agent')
  console.log(`  Target: ${config.baseUrl}`)
  console.log(`  Headless: ${config.headless}`)
  console.log(`  Delay: ${config.minDelayMinutes}–${config.maxDelayMinutes} min`)
  console.log('═══════════════════════════════════════════\n')

  loadAccounts()
  startTime = Date.now()

  while (true) {
    await runCycle()

    const delay = randomDelayMs()
    const delayMin = Math.round(delay / 60000 * 10) / 10
    console.log(`  💤 Sleeping ${delayMin} min...`)
    await sleep(delay)
  }
}

process.on('SIGINT', () => {
  console.log('\n\nShutting down Hermes...')
  process.exit(0)
})

main().catch(async (err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
