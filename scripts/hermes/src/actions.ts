import type { Page } from 'playwright'
import { config } from './config.js'
import {
  randomModeratorTopic,
  randomAssistantReply,
  randomCommentatorReply,
  randomVisitorReply,
  randomNewMemberTopic,
} from './prompts.js'
import { fetchVisibleTopics } from './browser.js'
import type { Account } from './browser.js'

const STICKERS = [
  'https://cdn-icons-png.flaticon.com/512/6154/6154705.png',
  'https://cdn-icons-png.flaticon.com/512/742/742751.png',
  'https://cdn-icons-png.flaticon.com/512/4391/4391605.png',
  'https://cdn-icons-png.flaticon.com/512/1791/1791330.png',
  'https://cdn-icons-png.flaticon.com/512/2107/2107957.png',
]

async function maybeReact(page: Page, account: Account): Promise<void> {
  if (Math.random() > 0.5) return
  try {
    const reacts = page.locator('.react, .react-add')
    const count = await reacts.count()
    if (count === 0) return
    const idx = Math.floor(Math.random() * count)
    await reacts.nth(idx).click({ timeout: 5000 })
    await page.waitForTimeout(1500)
    console.log(`  ✨ ${account.name} reacted to a message`)
  } catch {}
}

async function maybeAddSticker(page: Page): Promise<void> {
  if (Math.random() > 0.25) return
  try {
    const stickerBtn = page.locator('.tools span[title="Add sticker"]')
    if (await stickerBtn.isVisible()) {
      await stickerBtn.click({ timeout: 3000 })
      await page.waitForTimeout(800)
      const stickers = page.locator('.sticker-picker img')
      const sc = await stickers.count()
      if (sc > 0) {
        await stickers.nth(Math.floor(Math.random() * sc)).click({ timeout: 3000 })
        await page.waitForTimeout(500)
      }
    }
  } catch {}
}


async function typeSlowly(page: Page, selector: string, text: string, delayMs = 40): Promise<void> {
  const el = page.locator(selector)
  await el.click()
  await el.fill('')
  for (const char of text) {
    await page.keyboard.type(char, { delay: Math.random() * delayMs + 20 })
  }
}

export async function doModeratorAction(page: Page, account: Account): Promise<boolean> {
  try {
    const topic = randomModeratorTopic()

    await page.goto(`${config.baseUrl}/forum/new`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })
    await page.waitForTimeout(1500)

    await page.waitForSelector('input[placeholder]', { timeout: 10000 })

    const inputs = page.locator('input')
    const textareas = page.locator('textarea')

    await inputs.first().fill(topic.title)

    const contentInput = textareas.first()
    await contentInput.fill(topic.content)

    const allInputs = await inputs.all()
    if (allInputs.length > 1) {
      const tagsInput = allInputs[1]
      await tagsInput.fill(topic.tags.join(', '))
    }

    await page.click('button[type="submit"]')

    await page.waitForTimeout(3000)
    console.log(`  ✅ Moderator ${account.name} created topic: "${topic.title.slice(0, 60)}..."`)
    return true
  } catch (err) {
    console.error(`  ❌ Moderator action failed for ${account.name}:`, err instanceof Error ? err.message : err)
    return false
  }
}

export async function doAssistantAction(page: Page, account: Account): Promise<boolean> {
  try {
    const ids = await fetchVisibleTopics(page)
    if (ids.length === 0) {
      console.log(`  ⚠️  No topics found for assistant ${account.name}`)
      return false
    }

    const topicId = ids[Math.floor(Math.random() * Math.min(ids.length, 3))]
    await page.goto(`${config.baseUrl}/forum/${topicId}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })
    await page.waitForTimeout(1500)

    const reply = randomAssistantReply()

    const textarea = page.locator('textarea')
    if ((await textarea.count()) === 0) {
      console.log(`  ⚠️  No reply form on topic for assistant ${account.name}`)
      return false
    }

    await textarea.fill(reply)
    await maybeAddSticker(page)

    const submitBtn = page.locator('button[type="submit"]')
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
      await page.waitForTimeout(3000)
      await maybeReact(page, account)
      console.log(`  ✅ Assistant ${account.name} replied to topic ${topicId.slice(0, 8)}`)
      return true
    }

    return false
  } catch (err) {
    console.error(`  ❌ Assistant action failed for ${account.name}:`, err instanceof Error ? err.message : err)
    return false
  }
}

export async function doCommentatorAction(page: Page, account: Account): Promise<boolean> {
  try {
    const ids = await fetchVisibleTopics(page)
    if (ids.length === 0) {
      console.log(`  ⚠️  No topics found for commentator ${account.name}`)
      return false
    }

    const topicId = ids[Math.floor(Math.random() * ids.length)]
    await page.goto(`${config.baseUrl}/forum/${topicId}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })
    await page.waitForTimeout(1500)

    const reply = randomCommentatorReply()

    const textarea = page.locator('textarea')
    if ((await textarea.count()) === 0) {
      console.log(`  ⚠️  No reply form on topic for commentator ${account.name}`)
      return false
    }

    await textarea.fill(reply)
    await maybeAddSticker(page)

    const submitBtn = page.locator('button[type="submit"]')
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
      await page.waitForTimeout(3000)
      await maybeReact(page, account)
      console.log(`  ✅ Commentator ${account.name} replied to topic ${topicId.slice(0, 8)}`)
      return true
    }

    return false
  } catch (err) {
    console.error(`  ❌ Commentator action failed for ${account.name}:`, err instanceof Error ? err.message : err)
    return false
  }
}

export async function doVisitorAction(page: Page, account: Account): Promise<boolean> {
  try {
    const ids = await fetchVisibleTopics(page)
    if (ids.length === 0) {
      console.log(`  ⚠️  No topics found for visitor ${account.name}`)
      return false
    }

    const topicId = ids[Math.floor(Math.random() * ids.length)]
    await page.goto(`${config.baseUrl}/forum/${topicId}`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })
    await page.waitForTimeout(1500)

    const reply = randomVisitorReply()

    const textarea = page.locator('textarea')
    if ((await textarea.count()) === 0) {
      console.log(`  ⚠️  No reply form on topic for visitor ${account.name}`)
      return false
    }

    await textarea.fill(reply)
    await maybeAddSticker(page)

    const submitBtn = page.locator('button[type="submit"]')
    if (await submitBtn.isVisible()) {
      await submitBtn.click()
      await page.waitForTimeout(3000)
      await maybeReact(page, account)
      console.log(`  ✅ Visitor ${account.name} commented on topic ${topicId.slice(0, 8)}`)
      return true
    }

    return false
  } catch (err) {
    console.error(`  ❌ Visitor action failed for ${account.name}:`, err instanceof Error ? err.message : err)
    return false
  }
}

export async function doNewMemberAction(page: Page, account: Account): Promise<boolean> {
  try {
    const topic = randomNewMemberTopic(account.name)

    await page.goto(`${config.baseUrl}/forum/new`, {
      waitUntil: 'networkidle',
      timeout: 30000,
    })
    await page.waitForTimeout(1500)

    await page.waitForSelector('input[placeholder]', { timeout: 10000 })

    const inputs = page.locator('input')
    const textareas = page.locator('textarea')

    await inputs.first().fill(topic.title)

    const contentInput = textareas.first()
    await contentInput.fill(topic.content)

    const allInputs = await inputs.all()
    if (allInputs.length > 1) {
      const tagsInput = allInputs[1]
      await tagsInput.fill(topic.tags.join(', '))
    }

    await page.click('button[type="submit"]')

    await page.waitForTimeout(3000)
    console.log(`  ✅ New member ${account.name} posted introduction: "${topic.title.slice(0, 60)}..."`)
    return true
  } catch (err) {
    console.error(`  ❌ NewMember action failed for ${account.name}:`, err instanceof Error ? err.message : err)
    return false
  }
}

export const actionMap: Record<string, (page: Page, account: Account) => Promise<boolean>> = {
  moderator: doModeratorAction,
  assistant: doAssistantAction,
  commentator: doCommentatorAction,
  visitor: doVisitorAction,
  newMember: doNewMemberAction,
}
