import { chromium } from 'playwright'
import { existsSync } from 'node:fs'

const candidates = ['/root/.cache/ms-playwright/chromium-1234/chrome-linux/chrome'].filter(p => existsSync(p))
const browser = await chromium.launch({
  headless: true,
  ...(candidates.length > 0 ? { executablePath: candidates[0] } : {}),
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
})
const page = await browser.newPage()

// Test login as non-admin (Dumisani Khumalo - apprentice)
await page.goto('https://jobs.loseyourip.com/login', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(1500)
console.log('URL before:', page.url())

await page.fill('input[type="email"]', 'dumisani.khumalo.hermes22@loseyourip.hermes')
await page.fill('input[type="password"]', 'Hermes#22_pass')
await page.click('button[type="submit"]')
await page.waitForTimeout(4000)

console.log('URL after login:', page.url())
const body = await page.locator('body').textContent()
console.log('Has error:', body?.includes('Invalid credentials'))

// Now navigate to forum/new
await page.goto('https://jobs.loseyourip.com/forum/new', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(2000)
console.log('URL at /forum/new:', page.url())

const inputs = await page.locator('input').all()
console.log('Input count:', inputs.length)
for (const inp of inputs) {
  console.log('  input type:', await inp.getAttribute('type'), 'placeholder:', await inp.getAttribute('placeholder'))
}

const elCount = await page.locator('input[type="text"]').count()
console.log('input[type="text"] count:', elCount)

await browser.close()
