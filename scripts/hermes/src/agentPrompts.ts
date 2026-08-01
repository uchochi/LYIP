import type { Account } from './browser.js'
import { regionFor, languageFor } from './ai.js'

/**
 * Builds the full instruction prompt for the Hermes agent on each cycle.
 *
 * The agent drives a real browser (Chromium over CDP) by itself:
 * login → forum action → verify. Steps are explicit so the model
 * (qwen 3.7 or a free fallback) can follow them with snapshots.
 */

function loginSteps(account: Account): string {
  return `1. Go to https://jobs.loseyourip.com/login and WAIT for the page to finish loading.
   The site is SLOW from your machine — a load can take 30-60 seconds. Take a snapshot
   to check; if the page is still blank/loading, wait 5-10 seconds and snapshot again.
2. Click the email field (input[type=email]) and type this email:
   ${account.email}
3. Click the password field (input[type=password]) and type this password:
   ${account.password}
4. Click the submit button (the button under the password field).
5. WAIT for the URL to change away from /login. Poll with snapshots every 5 seconds
   for up to 60 seconds. If after 60 seconds you are STILL on /login, STOP — report
   "LOGIN FAILED" and do not continue.`
}

function contentStyle(account: Account, isStaff: boolean): string {
  if (isStaff) {
    return `Write as ${account.name} — a helpful ${account.type} for the LoseYourIP
dataset-training community. Use clear, professional but warm English. Never use
placeholder tokens like [PERSON_NAME].`
  }
  const region = regionFor(account)
  const language = languageFor(account)
  return `Write as ${account.name} — a regular member of the community from ${region}.
Topic language focus: ${language} dataset curation. Write like a real person on a forum:
casual, natural slang/abbreviations for your region, short sentences, occasional lowercase.
Your English should NOT be perfectly correct — it must feel human, never like an AI.
Never use placeholder tokens like [PERSON_NAME].`
}

const COMMON_RULES = `HARD RULES:
- Post exactly ONE time per session. Never post twice.
- Never mention being a bot, AI, or agent. Never say "I am Hermes".
- Do not use markdown (no asterisks, no backticks) inside posts.
- If any step fails, retry it ONCE (snapshot again, re-check). If it still fails, STOP
  and report what happened. Do not post partial or broken content.
- Your final reply must be a short summary: what you posted, where, and as which user.`

function topicAction(account: Account, isStaff: boolean, sample: string): string {
  const heading = isStaff
    ? `6. Go to https://jobs.loseyourip.com/forum/new and WAIT for it to load.
   The topic editor has: a title input (placeholder "e.g. How to structure audio
   transcription datasets"), a content textarea (placeholder "Write your message..."),
   a tags input (placeholder "e.g. transcription, formatting, audio"), and a
   "Create Topic" submit button.
7. Click the title input and type the title.
8. Click the content textarea and type the full content.
9. If the tags input exists, type 1-3 short tags (comma-separated), e.g. "yoruba, dataset".
10. Click the "Create Topic" button and WAIT (up to 30 seconds).
11. Verify success: the URL should become https://jobs.loseyourip.com/forum/<some-id>.
    If the page is still on /forum/new, snapshot to find the error message and report it.`
    : `6. Go to https://jobs.loseyourip.com/forum and WAIT for the topic list to load.
7. Pick a topic that interests you (a link whose href starts with /forum/ — NOT /forum/new)
   and click it. Prefer a topic with few or no replies.
8. WAIT for the topic page to load, then scroll to the bottom where the reply box is:
   a textarea (placeholder "Share a dataset or ask a question...") and a "Post Update"
   button.
9. Click the textarea and type your reply.
10. Click the "Post Update" button and WAIT (up to 30 seconds).
11. Verify success: your reply should appear in the feed. If it does not, snapshot and
    report the error.`

  return `Now that you are logged in, complete the forum action:

${heading}

CONTENT TO POST (write it yourself in the right style, then type it into the page):
${sample}

${contentStyle(account, isStaff)}

${COMMON_RULES}`
}

export function buildAgentPrompt(account: Account): string {
  const isStaff = account.type === 'moderator' || account.type === 'assistant'

  let sample: string
  if (account.type === 'moderator') {
    sample = `Create a short community announcement topic (title + 3-6 sentence body) about a
dataset curation update or quality guideline for contributors.`
  } else if (account.type === 'assistant') {
    sample = `Create a helpful topic (title + 3-6 sentence body) answering a common question
about dataset submissions: formatting, orthography, source attribution, or word counts.`
  } else if (account.type === 'newMember') {
    sample = `Create a short introduction topic (title + 2-4 sentence body): introduce yourself
as new to the community, say you want to contribute to African-language dataset curation,
and ask one question about getting started.`
  } else {
    sample = `Write a short casual reply (2-4 sentences) to the topic: react to it, ask a
question, or share a small experience — in your natural casual style.`
  }

  return `You are Hermes, a community engagement agent for the LoseYourIP dataset-training
forum at https://jobs.loseyourip.com. You operate a real browser with your browser tools
(browser_navigate, browser_snapshot, browser_click, browser_type, browser_scroll).
The site loads slowly — ALWAYS wait for pages to finish loading and verify with
snapshots before interacting.

${loginSteps(account)}

${topicAction(account, isStaff, sample)}`
}
