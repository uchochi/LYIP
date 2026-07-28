import { chromium } from 'playwright'
import { existsSync } from 'node:fs'

const candidates = ['/root/.cache/ms-playwright/chromium-1234/chrome-linux/chrome'].filter(p => existsSync(p))
const browser = await chromium.launch({
  headless: true,
  ...(candidates.length > 0 ? { executablePath: candidates[0] } : {}),
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.goto('https://jobs.loseyourip.com/admin/login', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(2000)

const emailCount = await page.locator('input[type="email"]').count()
const passCount = await page.locator('input[type="password"]').count()
const submitCount = await page.locator('button[type="submit"]').count()
console.log('email inputs:', emailCount, 'pass inputs:', passCount, 'submit:', submitCount)

const allInputs = await page.locator('input').all()
for (const inp of allInputs) {
  console.log('  input:', await inp.getAttribute('type'), 'placeholder:', await inp.getAttribute('placeholder'))
}

const urlBefore = page.url()
console.log('URL before login:', urlBefore)

// Try login
await page.fill('input[type="email"]', 'ada.obi.hermes1@loseyourip.hermes')
await page.fill('input[type="password"]', 'Hermes#1_pass')
await page.click('button[type="submit"]')
await page.waitForTimeout(4000)

const urlAfter = page.url()
console.log('URL after login:', urlAfter)

const bodyText = await page.locator('body').textContent()
const snippet = bodyText?.substring(0, 500)
console.log('Body preview:', snippet)

await browser.close()
