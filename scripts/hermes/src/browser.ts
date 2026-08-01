import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { existsSync } from 'node:fs'
import { config } from './config.js'

export interface Account {
  email: string
  password: string
  name: string
  role: string
  type: string
}

async function launchBrowser(): Promise<Browser> {
  const candidates = [
    '/root/.cache/ms-playwright/chromium-1234/chrome-linux/chrome',
    process.env.PLAYWRIGHT_CHROMIUM_PATH || '',
  ].filter(Boolean).filter(p => existsSync(p))

  return await chromium.launch({
    headless: config.headless,
    ...(candidates.length > 0 ? { executablePath: candidates[0] } : {}),
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  })
}

export async function createContext(): Promise<{ browser: Browser; context: BrowserContext; page: Page }> {
  const browser = await launchBrowser()
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()
  return { browser, context, page }
}

export async function closeAll(browser: Browser): Promise<void> {
  try { await browser.close() } catch {}
}

export async function login(page: Page, email: string, password: string): Promise<boolean> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto(`${config.baseUrl}/login`, {
        waitUntil: 'domcontentloaded',
        timeout: 90000,
      })
      break
    } catch (err) {
      if (attempt === 3) {
        console.log(`  Login error for ${email}:`, err instanceof Error ? err.message : err)
        return false
      }
      console.log(`  Login navigation failed (attempt ${attempt}/3), retrying...`)
      await page.waitForTimeout(5000)
    }
  }
  try {
    await page.waitForTimeout(1500)

    await page.waitForSelector('input[type="email"]', { timeout: 15000 })
    await page.fill('input[type="email"]', email)

    await page.waitForSelector('input[type="password"]', { timeout: 5000 })
    await page.fill('input[type="password"]', password)

    await page.click('button[type="submit"]')

    // Poll until we leave /login (success) or see an error — the slow CDN
    // link can push the post-login redirect past a fixed sleep.
    const deadline = Date.now() + 60000
    while (Date.now() < deadline) {
      await page.waitForTimeout(1000)
      const url = page.url()
      if (!url.includes('/login')) return true
      const errText = await page.locator('.text-red-500').first().textContent().catch(() => null)
      if (errText) {
        console.log(`  Login failed: ${errText}`)
        return false
      }
    }

    console.log('  Login failed: timed out waiting for redirect after submit')
    return false
  } catch (err) {
    console.error(`  Login error for ${email}:`, err instanceof Error ? err.message : err)
    return false
  }
}

export async function goToForum(page: Page): Promise<void> {
  await page.goto(`${config.baseUrl}/forum`, {
    waitUntil: 'domcontentloaded',
    timeout: 90000,
  })
  await page.waitForTimeout(1500)
}

export async function fetchVisibleTopics(page: Page): Promise<string[]> {
  await goToForum(page)
  const links = page.locator('a[href^="/forum/"]')
  const count = await links.count()
  const ids: string[] = []
  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute('href')
    if (href && href !== '/forum/new') {
      const m = href.match(/^\/forum\/(.+)/)
      if (m) ids.push(m[1])
    }
  }
  return ids
}
