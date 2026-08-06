# Hermes Agent — Setup & Task Isolation

The Hermes agent is a Python CLI (`hermes`) installed on this device. It drives a real headless
browser (Chromium over CDP) and can be used for **any** task. One of those tasks is the autonomous
LoseYourIP forum poster.

This doc explains the **isolation architecture** that keeps the forum bot's context from leaking
into other tasks, how the forum poster is wired, and how to add a new task without polluting the
agent's global soul.

---

## Isolation principle (important)

The agent loads one **global soul** on every run. To keep the agent reusable for anything, that
soul is **task-agnostic** — it contains NO forum text. Each task instead ships its own **mission
file**, injected into the run via `hermes --query`. Non-forum tasks never see the forum mission,
and the forum task never sees other tasks' missions.

```
                       ┌──────────────────────────┐
   every `hermes` run → │  ~/.hermes/SOUL.md       │  ← GENERIC assistant (no task specifics)
                       └──────────────────────────┘
                                   +
              ┌────────────────────┴────────────────────┐
              │                                         │
   forum run: │  --query = FORUM-MISSION.md + account   │   other task: --query = <that task>
              │                                         │
```

### Why via `--query`?
`hermes` has **no per-run `--soul`/`--mission` flag** (confirmed via `hermes --help`). The only
channel for per-task context is the query string, so missions are delivered there. The global
`SOUL.md` stays clean.

---

## File map

| File | Tracked? | Purpose |
|---|---|---|
| `~/.hermes/SOUL.md` | device only | **Generic** assistant identity only — no task specifics. Safe for any task. |
| `~/.hermes/config.yaml` | device only | Default model `qwen/qwen3.7-plus`, provider `openrouter`, memory settings. |
| `~/.hermes/lyip-post.sh` | device only | Forum runner: picks an account, loads the mission, calls `hermes --query`. |
| `~/.hermes/.env` | device only | `OPENROUTER_API_KEY`. |
| `scripts/hermes/FORUM-MISSION.md` | **repo** | The forum mission (site, accounts overview, writing styles, hard rules). Loaded only by `lyip-post.sh`. No credentials. |
| `scripts/hermes/accounts.json` | gitignored | 100 community accounts (name/email/password/role/type). |
| `scripts/hermes/src/personas.ts` | repo | Canonical persona definitions (emails derived from names). Source for `accounts.json`. |
| `scripts/hermes/src/generateAccounts.ts` | repo | Regenerates `accounts.json` from `personas.ts`. |

> `accounts.json` and `FORUM-MISSION.md` are decoupled: the mission has **no credentials**, so it
> can be version-controlled safely. The runner reads both at runtime.

---

## Forum poster — how a run works

1. **Crontab** fires every 3 hours (`0 */3 * * *`) → `~/.hermes/lyip-post.sh`.
2. The wrapper sleeps a random 0–30 min jitter, then picks one random account from `accounts.json`.
3. It reads `scripts/hermes/FORUM-MISSION.md` and builds a single `--query` containing:
   - the full forum mission (site, personas, writing styles, hard rules), **plus**
   - this run's specifics: the chosen account's email/password, the action (create topic vs reply),
     and the writing style for that persona.
4. `hermes --query "<mission + run>" --model qwen/qwen3.7-plus --provider openrouter --toolsets browser --max_turns 25 --quiet --compact`
5. The agent launches headless Chromium, logs in at `/login`, posts/replies on `/forum`, verifies,
   and exits. SOUL.md contributes only the generic assistant identity.

### Persona weights
Roughly 3% moderator, 12% assistant, 25% commentator, 35% visitor, 25% newMember (defined in
`config.ts` `personaWeights`; the cron runner picks uniformly at random today).

---

## Quickstart

```bash
# One manual forum post (runs the isolated forum runner)
/root/.hermes/lyip-post.sh

# Watch the log
tail -f /tmp/opencode/hermes/agent.log

# Use the agent for ANY OTHER task (clean slate — no forum context)
hermes --query "your task here" --model qwen/qwen3.7-plus --provider openrouter --toolsets browser
```

---

## Adding a NEW task (without polluting the soul)

To use the agent for something else, **do not** edit `SOUL.md`. Instead follow the same pattern as
the forum poster:

1. **Write a mission file** for the task, e.g. `scripts/<task>/MISSION.md` — describe the goal,
   constraints, and rules. Keep credentials OUT (store them separately, like `accounts.json`).
2. **Write a runner script** that builds the per-run specifics and assembles the query:
   ```bash
   MISSION="$(cat scripts/<task>/MISSION.md)"
   QUERY="${MISSION}

   ---

   # THIS RUN
   <run-specific details, credentials, action>"
   hermes --query "$QUERY" --model qwen/qwen3.7-plus --provider openrouter --toolsets <toolsets>
   ```
3. **Schedule it** (cron) if it should run autonomously.
4. Because `SOUL.md` stays generic, this task and the forum poster never interfere with each other.

> If a task genuinely needs a *different* persistent identity, give it its own mission file — not a
> fork of `SOUL.md`. The soul is shared infrastructure.

---

## Schedule

- Forum posts every 3 hours (00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00 UTC), plus
  0–30 min random jitter.

Change the frequency by editing the crontab:

```bash
crontab -e
# every 2 hours → 0 */2 * * *
# every hour   → 0 * * * *
```

---

## Verifying forum posts

```bash
# Recent topics in Supabase
# (via MCP) supabase_execute_sql: SELECT title, author_id, created_at FROM forum_topics ORDER BY created_at DESC LIMIT 5;

# Or browse: https://jobs.loseyourip.com/forum
```

---

## Stopping / starting the forum poster

```bash
# Stop (remove the crontab entry)
crontab -l | grep -v lyip-post.sh | crontab -

# Start (re-add)
(crontab -l 2>/dev/null; echo "0 */3 * * * /root/.hermes/lyip-post.sh") | crontab -

# Kill any stuck agent
pkill -9 -f "[a]gent-browser"
```

---

## Interactive mode

You can also drive the agent live. Because `SOUL.md` is generic, an interactive session starts
with a clean slate — give it any task:

```bash
hermes --model qwen/qwen3.7-plus --provider openrouter -t browser
hermes --resume <session_id>
```

For an interactive forum session, paste the contents of `scripts/hermes/FORUM-MISSION.md` as your
first message to load that mission into the session.

---

## Troubleshooting

- **"Chrome not found"** — ensure `AGENT_BROWSER_EXECUTABLE_PATH` points to the Playwright Chromium
  (the wrapper sets this automatically).
- **402 / credits** — check your OpenRouter balance at https://openrouter.ai/settings/credits.
- **No posts appearing** — check the log: `tail -50 /tmp/opencode/hermes/agent.log`.
- **"mission file not found"** — the runner aborts if `scripts/hermes/FORUM-MISSION.md` is missing;
  make sure the repo is checked out at `/root/loseyourip`.
- **Task feels "contaminated" by forum context** — confirm `~/.hermes/SOUL.md` contains only the
  generic assistant preamble (no "# LYIP FORUM MISSION"). If it does, move that block back into
  `scripts/hermes/FORUM-MISSION.md`.
