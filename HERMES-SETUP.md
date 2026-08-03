# Hermes Agent — Forum Boost Setup

The Hermes agent is a Python CLI installed on this device. It drives a real headless browser
(Chromium over CDP) to post on the LoseYourIP forum autonomously.

## Quickstart

```bash
# One manual post
/root/.hermes/lyip-post.sh

# Watch the log
tail -f /tmp/opencode/hermes/agent.log
```

## What's configured

| File | Purpose |
|---|---|
| `~/.hermes/SOUL.md` | Mission: forum URL, persona types, writing styles, hard rules, accounts path |
| `~/.hermes/config.yaml` | Default model `qwen/qwen3.7-plus`, provider `openrouter` |
| `~/.hermes/lyip-post.sh` | Wrapper: picks a random account, builds the agent query, runs `hermes --query` |
| `~/.hermes/.env` | OpenRouter API key (`OPENROUTER_API_KEY`) |
| `/root/loseyourip/scripts/hermes/accounts.json` | 100 community accounts |

## How it works (per post)

1. Crontab fires every 3 hours (`0 */3 * * *`).
2. The wrapper sleeps a random 0–30 min jitter, then picks a random account from
   `accounts.json` (weighted: 3% moderator, 12% assistant, 25% commentator, 35% visitor,
   25% newMember).
3. It embeds the account's email, password, name, and persona type into a natural-language
   instruction string.
4. `hermes --query "<instruction>" --model qwen/qwen3.7-plus --toolsets browser --max_turns 25`
   is called.
5. The agent launches headless Chromium (via agent-browser, auto-detects the Playwright
   Chromium build in `~/.cache/ms-playwright`), logs in at `https://jobs.loseyourip.com/login`,
   posts or replies on `/forum`, verifies the post, and exits.

## Schedule

- Posts every 3 hours (00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00 UTC).
- Plus 0–30 min random jitter so posts don't look scheduled.

Change the frequency by editing the crontab:

```bash
crontab -e
# Example: every 2 hours → 0 */2 * * *
# Example: every hour   → 0 * * * *
```

## Verifying posts

```bash
# Check the Supabase DB for recent topics
supabase_execute_sql "SELECT title, author_id, created_at FROM forum_topics ORDER BY created_at DESC LIMIT 5;"

# Or check the forum itself
# https://jobs.loseyourip.com/forum
```

## Stopping / starting

```bash
# Stop (remove crontab entry)
crontab -l | grep -v lyip-post.sh | crontab -

# Start (re-add)
(crontab -l 2>/dev/null; echo "0 */3 * * * /root/.hermes/lyip-post.sh") | crontab -

# Kill any stuck agent
pkill -9 -f "[a]gent-browser"
```

## Interactive mode

You can also drive the agent live instead of using cron. Start a session, then `--resume` it:

```bash
# Start an interactive session
hermes --model qwen/qwen3.7-plus --provider openrouter -t browser

# Resume a previous session
hermes --resume <session_id>
```

Inside the interactive session you can give it any forum task — the agent knows the mission
from `SOUL.md`.

## Troubleshooting

- **"Chrome not found"** — ensure `AGENT_BROWSER_EXECUTABLE_PATH` points to the Playwright
  Chromium (the wrapper sets this automatically).
- **402 / credits** — check your OpenRouter balance at https://openrouter.ai/settings/credits.
- **No posts appearing** — check the log: `tail -50 /tmp/opencode/hermes/agent.log`.
