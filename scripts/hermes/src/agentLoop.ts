import { spawn } from 'node:child_process'
import { config } from './config.js'
import type { Account } from './browser.js'
import { loadAccounts, pickAccount, sleep, randomDelayMs } from './scheduler.js'
import { buildAgentPrompt } from './agentPrompts.js'
import { launchCdpBrowser, closeCdpBrowser } from './browserCdp.js'

/**
 * Agent-driven Hermes loop.
 *
 * Each cycle:
 *  1. picks an account + persona (weighted, same as the Playwright bot)
 *  2. builds a detailed instruction prompt (login + forum action + style)
 *  3. launches a fresh headless Chromium with a CDP debug port
 *  4. runs the hermes-agent CLI in non-interactive mode, pointing it at the
 *     Chromium via BROWSER_CDP_URL so the agent drives the browser natively
 *  5. tears the browser down and sleeps a human-like random delay
 *
 * Env overrides:
 *  HERMES_AGENT_MODEL      model to use (default qwen/qwen3.7-plus)
 *  HERMES_AGENT_MAX_TURNS  max agent steps per cycle (default 25)
 *  HERMES_AGENT_TIMEOUT_MS hard timeout per cycle (default 10 min)
 *  HERMES_AGENT_DRYRUN=1   print prompts only, never run the agent
 */

function log(msg: string): void {
  console.log(`[${new Date().toISOString()}] ${msg}`)
}

function runAgent(
  prompt: string,
  cdpUrl: string
): Promise<{ code: number | null; output: string; timedOut: boolean }> {
  return new Promise((resolve) => {
    const args = [
      config.agentCli,
      '--query',
      prompt,
      '--model',
      config.agentModel,
      '--provider',
      'openrouter',
      '--toolsets',
      'browser',
      '--max_turns',
      String(config.agentMaxTurns),
      '--quiet',
    ]

    const child = spawn(config.agentPython, args, {
      env: {
        ...process.env,
        BROWSER_CDP_URL: cdpUrl,
        AGENT_BROWSER_ARGS: '--no-sandbox,--disable-dev-shm-usage',
      },
    })

    let output = ''
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      child.kill('SIGKILL')
    }, config.agentTimeoutMs)

    child.stdout.on('data', (d: Buffer) => (output += d.toString()))
    child.stderr.on('data', (d: Buffer) => (output += d.toString()))
    child.on('close', (code) => {
      clearTimeout(timer)
      resolve({ code, output, timedOut })
    })
    child.on('error', (err) => {
      clearTimeout(timer)
      resolve({ code: null, output: `spawn error: ${err.message}`, timedOut })
    })
  })
}

async function runCycle(cycle: number, account: Account, actionType: string): Promise<void> {
  log(`Cycle #${cycle}: ${account.name} (${account.email}) as ${actionType}`)

  if (config.agentDryRun) {
    console.log('\n' + '='.repeat(70))
    console.log(buildAgentPrompt(account))
    console.log('='.repeat(70) + '\n')
    return
  }

  const browser = await launchCdpBrowser()
  log(`  Chromium up at ${browser.cdpUrl}`)
  try {
    const { code, output, timedOut } = await runAgent(buildAgentPrompt(account), browser.cdpUrl)
    if (timedOut) {
      log(`  ✗ agent timed out after ${config.agentTimeoutMs / 1000}s (killed)`)
    } else if (code !== 0) {
      log(`  ✗ agent exited with code ${code}`)
    } else {
      log(`  ✓ agent finished`)
    }
    const tail = output.split('\n').filter(Boolean).slice(-12).join('\n')
    log(`  --- agent output tail ---\n${tail}\n  -------------------------`)
  } finally {
    closeCdpBrowser(browser)
  }
}

async function main(): Promise<void> {
  loadAccounts()
  log(`Hermes agent loop starting — model=${config.agentModel} dryRun=${config.agentDryRun}`)

  let cycle = 0
  for (;;) {
    cycle++
    const { account, actionType } = pickAccount()
    try {
      await runCycle(cycle, account, actionType)
    } catch (err) {
      log(`  ✗ cycle error: ${err instanceof Error ? err.message : err}`)
    }

    const delay = config.agentDryRun ? 2000 : randomDelayMs()
    const next = new Date(Date.now() + delay)
    log(`  sleeping ${Math.round(delay / 1000)}s — next run ~${next.toLocaleTimeString()}`)
    await sleep(delay)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
