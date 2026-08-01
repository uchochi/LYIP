import { spawn, type ChildProcess } from 'node:child_process'
import { existsSync } from 'node:fs'

/**
 * Launches a fresh headless Chromium per cycle with a CDP debug port.
 * The Hermes agent connects to it natively via BROWSER_CDP_URL.
 */

const CHROMIUM_CANDIDATES = [
  '/root/.cache/ms-playwright/chromium-1234/chrome-linux/chrome',
  process.env.PLAYWRIGHT_CHROMIUM_PATH || '',
].filter(Boolean)

export function findChromium(): string | null {
  return CHROMIUM_CANDIDATES.find((p) => existsSync(p)) ?? null
}

export interface CdpBrowser {
  cdpUrl: string
  child: ChildProcess
}

export function launchCdpBrowser(): Promise<CdpBrowser> {
  return new Promise((resolve, reject) => {
    const chromePath = findChromium()
    if (!chromePath) {
      reject(new Error('Chromium not found — install playwright chromium first'))
      return
    }

    const port = 9222 + Math.floor(Math.random() * 200)
    const profile = `/tmp/hermes-cdp-${process.pid}-${port}`

    const child = spawn(
      chromePath,
      [
        '--headless=new',
        `--remote-debugging-port=${port}`,
        `--user-data-dir=${profile}`,
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-background-networking',
        '--no-first-run',
        'about:blank',
      ],
      { stdio: 'ignore' }
    )

    const cdpUrl = `http://127.0.0.1:${port}`

    // Wait for the CDP endpoint to accept connections
    const deadline = Date.now() + 30000
    const probe = async () => {
      if (Date.now() > deadline) {
        child.kill('SIGKILL')
        reject(new Error('Timed out waiting for Chromium CDP endpoint'))
        return
      }
      try {
        const res = await fetch(`${cdpUrl}/json/version`, { signal: AbortSignal.timeout(2000) })
        if (res.ok) {
          resolve({ cdpUrl, child })
          return
        }
      } catch {}
      setTimeout(probe, 500)
    }
    probe()
  })
}

export function closeCdpBrowser(b: CdpBrowser): void {
  try {
    b.child.kill('SIGTERM')
    setTimeout(() => {
      try {
        b.child.kill('SIGKILL')
      } catch {}
    }, 2000).unref()
  } catch {}
}
