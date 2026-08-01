import { existsSync, readFileSync } from 'node:fs'
import { config } from './config.js'
import type { Account } from './browser.js'

/**
 * AI content generation for Hermes posts.
 *
 * Personas:
 *  - moderator / assistant → proper, professional English (staff voices)
 *  - commentator / visitor / newMember → casual, regional slang + abbreviations
 *
 * Region and language are derived deterministically from the account email so
 * each persona stays consistent (same region every time).
 */

export interface GeneratedTopic {
  title: string
  content: string
  tags: string[]
}

interface ChatResult {
  ok: boolean
  content?: string
  error?: string
}

const REGIONS = [
  { name: 'Nigerian', slang: 'Nigerian Pidgin slang: abeg, wahala, no dey, o, sha, na so, dem, wetin, e dey, mehn, joor' },
  { name: 'Ghanaian', slang: 'Ghanaian slang: chale, eiii, walahi, make we, dey, I no sabi, hot, asap, my guy' },
  { name: 'Kenyan', slang: 'Kenyan slang: sa wa, poa, niko sawa, sasa, ni kawaida, asante, mzigo, kitu kidogo' },
  { name: 'South African', slang: 'South African slang: eish, sharp, yebo, bra, howzit, aweh, mzansi, lekker' },
  { name: 'East African', slang: 'Swahili-flavoured: pole pole, sawa sawa, hakuna matata, karibu, asante sana' },
]

const LANGUAGES = ['Hausa', 'Yoruba', 'Igbo', 'Swahili', 'Zulu', 'Amharic', 'Wolof', 'Shona']

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

function pickFor<T>(seed: number, arr: T[]): T {
  return arr[seed % arr.length]
}

function regionFor(account: Account): string {
  const r = pickFor(hashString(account.email), REGIONS)
  return `${r.name} (style hints: ${r.slang})`
}

function languageFor(account: Account): string {
  return pickFor(hashString(account.email + ':lang'), LANGUAGES)
}

function readOpenRouterKey(): string | null {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY
  // The hermes-agent on this device stores its key in ~/.hermes/.env
  const envPath = '/root/.hermes/.env'
  if (existsSync(envPath)) {
    try {
      const line = readFileSync(envPath, 'utf-8')
        .split('\n')
        .find((l) => l.trim().startsWith('OPENROUTER_API_KEY'))
      if (line) {
        const m = line.match(/=\s*["']?([^"'\s]+)/)
        if (m) return m[1]
      }
    } catch {}
  }
  return null
}

async function chat(
  messages: { role: string; content: string }[],
  maxTokens: number
): Promise<ChatResult> {
  const key = readOpenRouterKey()
  if (!key) return { ok: false, error: 'no OPENROUTER_API_KEY available' }

  const models = [config.aiModel, 'poolside/laguna-s-2.1:free'].filter(Boolean)
  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature: 0.9,
        }),
        signal: AbortSignal.timeout(90000),
      })

      if (!res.ok) {
        const body = await res.text().catch(() => '')
        console.log(`  ⚠️  AI model ${model} failed (${res.status}): ${body.slice(0, 120)}`)
        continue // try next model
      }

      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[]
      }
      const content = data.choices?.[0]?.message?.content?.trim()
      if (!content) {
        console.log(`  ⚠️  AI model ${model} returned empty content`)
        continue
      }
      return { ok: true, content }
    } catch (err) {
      console.log(`  ⚠️  AI request error: ${err instanceof Error ? err.message : err}`)
    }
  }
  return { ok: false, error: 'all AI models failed' }
}

/** Strip surrounding quotes / labels a model sometimes adds. */
function cleanReply(content: string, accountName: string): string {
  let out = content.trim()
  // Remove common wrapping: `Here's something like: "..."` → take the quoted part
  const quoteMatch = out.match(/"[^"]{20,}"/)
  if (quoteMatch && quoteMatch[0].length > out.length / 2) out = quoteMatch[0]
  // Strip leading labels like "Comment:" / "Reply:" / "Content:" / "Title:"
  out = out.replace(/^(comment|reply|response|content|title|topic)\s*[:.-]\s*/i, '').trim()
  // Remove any surrounding quotes
  if (out.startsWith('"') && out.endsWith('"')) out = out.slice(1, -1)
  // Models sometimes emit placeholder tokens like [PERSON_NAME] — swap in the account name
  out = out.replace(/\[(?:PERSON_NAME|NAME|USER|USERNAME|AUTHOR)\]/gi, accountName)
  return out.trim()
}

function parseTopicJson(raw: string, accountName: string): GeneratedTopic | null {
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    if (start === -1 || end === -1) return null
    const obj = JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>
    const title = String(obj.title ?? '').trim().replace(/\[(?:PERSON_NAME|NAME|USER|USERNAME|AUTHOR)\]/gi, accountName)
    const content = String(obj.content ?? '').trim().replace(/\[(?:PERSON_NAME|NAME|USER|USERNAME|AUTHOR)\]/gi, accountName)
    const tags = Array.isArray(obj.tags) ? obj.tags.map((t) => String(t).trim()).filter(Boolean) : []
    if (!title || !content) return null
    return { title, content, tags: tags.slice(0, 4) }
  } catch {
    return null
  }
}

const SYSTEM_STAFF =
  'You are a staff member of the LoseYourIP dataset-training community (moderator or assistant). ' +
  'You write in clear, professional but warm English. You help community members with dataset ' +
  'curation for African languages. Be specific, encouraging, and slightly formal. ' +
  'Your reply must be ONLY the output text — no quotes, no labels, no explanation.'

const SYSTEM_CASUAL =
  'You are a regular member of a dataset-curation community for African languages. ' +
  'You write the way real people actually write on forums: casual, informal, with natural ' +
  'slang and abbreviations from your region, occasional lowercase, short sentences. ' +
  'Your English is NOT perfectly correct — you type naturally, like a normal person, not an AI. ' +
  'Never use placeholder tokens like [PERSON_NAME]. ' +
  'Your reply must be ONLY the output text — no quotes, no labels, no explanation.'

const TOPIC_SYSTEM_CASUAL =
  'You are a regular member of a dataset-curation community for African languages. ' +
  'You write the way real people actually write on forums: casual, informal, with natural ' +
  'slang and abbreviations from your region, occasional lowercase. ' +
  'Reply ONLY with a JSON object: {"title": "...", "content": "...", "tags": ["a", "b"]}. ' +
  'No markdown, no extra text.'

const TOPIC_SYSTEM_STAFF =
  'You are a staff member of the LoseYourIP dataset-training community. You post official ' +
  'announcements and helpful topics in clear, professional but warm English. ' +
  'Reply ONLY with a JSON object: {"title": "...", "content": "...", "tags": ["a", "b"]}. ' +
  'No markdown, no extra text.'

export async function generateReply(persona: 'moderator' | 'assistant' | 'commentator' | 'visitor', account: Account): Promise<string | null> {
  const language = languageFor(account)
  const region = regionFor(account)

  const user =
    persona === 'moderator' || persona === 'assistant'
      ? `Write a ${persona} reply in a forum topic about ${language} dataset curation.\n` +
        (persona === 'assistant'
          ? 'Give helpful feedback or guidance about dataset submissions (formatting, orthography, source attribution, word counts). 3-6 sentences.\n'
          : 'Respond to the community: acknowledge good work, share a quality tip, or give a status update. 3-6 sentences.\n') +
        'Clear professional English.\n'
      : `Write a casual forum comment on a topic about ${language} dataset curation (contributors get paid per dataset).\n` +
        `Your region: ${region}.\n` +
        `Persona: ${persona === 'visitor' ? 'new visitor who just found the project — short, excited, very casual' : 'active community member — a few sentences, asks a question or shares an experience'}.\n` +
        'Use natural slang, abbreviations and casual style. 2-4 sentences. Make it feel human, not written by an AI.\n'

  const res = await chat(
    [
      { role: 'system', content: persona === 'moderator' || persona === 'assistant' ? SYSTEM_STAFF : SYSTEM_CASUAL },
      { role: 'user', content: user },
    ],
    300
  )
  if (!res.ok) return null
  const cleaned = cleanReply(res.content!, account.name)
  return cleaned.length >= 20 ? cleaned : null
}

export async function generateTopic(persona: 'moderator' | 'newMember', account: Account): Promise<GeneratedTopic | null> {
  const language = languageFor(account)
  const region = regionFor(account)

  const user =
    persona === 'moderator'
      ? `Write a community announcement topic for ${language} dataset contributors.\n` +
        'Announce a new dataset opportunity, share quality-review findings, or give guidelines. ' +
        'Include a short header line, 2-4 short sections, and clear English. Clear professional English.\n'
      : `Write a short introduction topic from a new community member.\n` +
        `Your region: ${region}.\n` +
        'Introduce yourself, mention you want to contribute to African-language dataset curation, and ask a question. ' +
        'Use natural casual style with region-appropriate slang — like a real person, not an AI.\n'

  const res = await chat(
    [
      { role: 'system', content: persona === 'moderator' ? TOPIC_SYSTEM_STAFF : TOPIC_SYSTEM_CASUAL },
      { role: 'user', content: user },
    ],
    450
  )
  if (!res.ok) return null
  return parseTopicJson(res.content!, account.name)
}
