# Dataset Curation Experience — Build Plan & Review

> Status: **Awaiting your review.** Mark your choices (✅) next to each open
> decision, then say "go" and I'll build everything in the order listed in
> §7 (Execution Order).
>
> Confirmed so far: **Animation = framer-motion (`motion` pkg)** ·
> **Admin email = Resend via Edge Function**.

This plan covers all 4 things you asked for:

1. **Scroll-Telling Tutorial** (turns `AA.md` + `AB.md` into an experience).
2. **Dataset Submission page** with category selector + admin email + review/price flow.
3. **Quiz funnel → tutorial** + **Dataset Monitor** in the user dashboard.
4. **10–15 FAQs** about dataset curation.

---

## 0. Quick decisions (please pick)

> Reply with the option letters, e.g. `Q1: b, Q2: a, Q3: a, Q4: a, Q5: a, Q6: a`.
> If you don't reply, I'll use the **(Recommended)** defaults for all of them.

### Q1 — Tutorial & FAQ routes  *(the one you flagged)*
- **a) `/start` (Gateway) + `/start/:tool` (deep dives); FAQ on `/submit` AND `/faq`. Quiz CTA → `/start`. (Recommended)
- b) `/tutorial` + `/tutorial/:tool`; FAQ only on `/submit` (no standalone route).
- c) Other: _______

### Q2 — Dataset storage method (how a user hands us their dataset)
- **a) Paste content in a textarea + optional URL link. Simplest, no file upload infra, reviewable instantly. (Recommended)**
- b) Real file upload to Supabase Storage (a `curator-datasets` bucket) — supports `.json/.csv/.txt/.parquet`. More powerful, adds Storage + bucket policies + virus-scan considerations.
- c) Both: paste OR upload (user picks).

### Q3 — Admin review UI location
- **a) New page `/admin/reviews` (admin-only) showing a queue table with Approve/Reject + propose price + notes. (Recommended)**
- b) Add a "Submissions" tab into the existing `/admin` jobs dashboard.
- c) Other: _______

### Q4 — How the "proposed price" gets set
- **a) Admin enters it manually when approving (full control). (Recommended)**
- b) Auto-calculated from category + entry count using a rate card I'll seed (e.g. base $X per 1,500 words), admin can override.
- c) Both: auto-suggest a number, admin confirms/edits.

### Q5 — Resend configuration
- I need 3 Edge Function **secrets**. You can add them now or after build:
  - `RESEND_API_KEY` — your Resend API key (free at resend.com).
  - `ADMIN_NOTIFY_EMAIL` — where admin alerts go (e.g. `admin@loseyourip.com`).
  - `FROM_EMAIL` — sending address verified in Resend (e.g. `alerts@loseyourip.com`).
- **a) I'll add these secrets myself after you build. Build the function to degrade gracefully (in-app notification only) until they exist. (Recommended)**
- b) I'll paste the values now so you wire them in.

### Q6 — Category list
Confirm or edit. Default set (each gets an icon + emoji):
`Jokes/Comedy/Memes`, `Health & Fitness`, `Tech & Innovation`, `Education & Learning`,
`Business & Finance`, `Entertainment`, `Science`, `History & Culture`, `Lifestyle`,
`Sports`, **`Other`** (user types a custom category).
- **a) Use this list as-is. (Recommended)**
- b) Add/remove: _______

---

## 1. Scroll-Telling Tutorial (from `AA.md` + `AB.md`)

**Visual rules applied:** dark background kept; heavy/bold typography; processes in
**Step Cards**; examples in **Code Windows** (syntax-highlighted); subtle background
hue-shift per section; every scroll triggers a reveal to create forward momentum.

### Gateway page (AA.md) — highly visual
- **Hero** — gradient + glow, headline "Architecting High-Fidelity Datasets at Scale",
  animated scroll cue.
- **Scroll-linked progress rail** down the left side that fills as you read.
- **4 pipeline stages**, each a full-width section:
  1. Signal Extraction → Step Cards + a Code Window showing Raw vs Synthesized text.
  2. Algorithmic Alignment → an alignment table whose rows reveal one-by-one on scroll.
  3. Structural Engineering → a JSON Code Window with line-by-line highlight.
  4. Intelligent Ground-Truthing → taxonomy cards + sentiment table.
- Background subtly shifts hue (blue → violet → cyan → emerald) per stage.
- **Synthesis Toolkit** — 3 tool cards (VS Code/Copilot, Label Studio, Prodigy) that
  link into the deep dives.
- **CTA** → `/submit` (Start Contributing) + link to FAQ.

### Knowledge pages (AB.md) — one route per tool, highly structured
Routes: `/start/vscode-copilot`, `/start/label-studio`, `/start/prodigy` (slugs TBD).
Each page:
- Tool hero + "what it is" blurb.
- **Setup** as numbered Step Cards.
- **How to Use** as Step Cards (Prodigy active-learning loop animates).
- **Pricing/Trial** cards.
- **The Edge (Pros) / The Friction (Cons)** two-column.
- **Summary table** + **The Bottom Line** pull-quote.
- Prev/Next tool nav + back to Gateway.

**New files:** `src/pages/start/GatewayPage.tsx`, `src/pages/start/ToolDeepDivePage.tsx`,
reusable `src/components/start/` (StepCard, CodeWindow, ScrollSection, ProgressRail,
StageHeader, ProsConsSplit, PricingCard, ToolNav). Shared tutorial content in
`src/content/tutorial.tsx`.

---

## 2. Dataset Submission (the page + the data + the email)

### New table: `curator_submissions`
```sql
create table public.curator_submissions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  title           text not null,
  description     text,                       -- what the dataset is about
  content         text,                       -- the pasted dataset / sample
  dataset_url     text,                       -- optional external link
  category        text not null,              -- one of the Q6 categories
  custom_category text,                       -- populated when category = 'other'
  format          text,                       -- json | csv | txt | parquet | other
  entry_count     integer,                    -- approx number of rows/entries
  status          text not null default 'pending'
                  check (status in ('pending','under_review','approved','rejected','needs_revision')),
  proposed_price  numeric(10,2),              -- set by admin on approval
  admin_notes     text,
  reviewed_by     uuid references auth.users(id),
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
-- RLS: users read/insert their own; admins read/update all.
-- Indexes: user_id, status, category.
-- updated_at trigger.
```

### Submission page `/submit` (protected — must be logged in)
- Title, Description, **Category selector** (Q6 list, grid of pills; "Other" reveals a
  custom text input), Format dropdown, Entry count, paste area + optional URL.
- Validation, success state: "Submitted — we'll review and get back with a price."
- **FAQ accordion** below the form (the 10–15 FAQs).

### Admin email (Resend via Edge Function)
- Edge Function `dataset-submission-notify` invoked by a **Database Webhook** on
  `curator_submissions INSERT`.
- Sends an HTML email via Resend to `ADMIN_NOTIFY_EMAIL` summarizing the submission
  with a deep link to `/admin/reviews`.
- **Always** also inserts a row into the existing `notifications` table for the admin
  (in-app signal), so it works even before Resend secrets are set.
- Secrets needed: `RESEND_API_KEY`, `ADMIN_NOTIFY_EMAIL`, `FROM_EMAIL` (see Q5).

### Admin review UI (`/admin/reviews`, per Q3)
- Queue table: title, submitter, category, status, submitted date.
- Drawer/modal to Approve (enter `proposed_price` + notes) / Reject (notes) /
  Set "Under Review". Updates row → triggers a notification back to the submitter.

**New files:** `src/pages/SubmitDatasetPage.tsx`, `src/pages/admin/ReviewsPage.tsx`,
`src/services/datasetService.ts`, Edge Function `supabase/functions/dataset-submission-notify/`.

---

## 3. Quiz funnel + Dashboard wiring

- **Quiz final slide** (`QuizResult`): primary CTA changes to
  **"Start the Tutorial →"** → `/start`. Keep `/learn` as a small secondary link.
- **Dashboard Dataset Monitor** (added to `UserDashboardPage`):
  - Summary tiles: Total submitted · Pending · Under Review · Approved · Rejected ·
    **Total earned (sum of approved proposed_price)**.
  - Table of the user's submissions: title, category, status badge, **proposed price
    (shown when approved)**, admin notes, date.
  - Empty state with a "Submit your first dataset →" CTA.

---

## 4. FAQs (10–15)

Drafted list (each with a concise answer) — covers: what dataset curation is, who can
submit, formats accepted, how pricing is decided, review time, rejection reasons,
ownership/licensing, payouts, quality bar, categories, plagiarism, revisions, data
privacy, min/max size, and how it connects to the curator role. Rendered as a reusable
`<FAQAccordion>` (animated expand/collapse) on `/submit` and `/faq`.

---

## 5. Route additions (to `src/App.tsx`)

| Path | Component | Layout | Protected |
|---|---|---|---|
| `/start` | GatewayPage | Marketing | No |
| `/start/:tool` | ToolDeepDivePage | Marketing | No |
| `/submit` | SubmitDatasetPage | Forum* | **Yes (user)** |
| `/faq` | FaqPage | Marketing | No |
| `/admin/reviews` | ReviewsPage | Bare | **Yes (admin)** |

\* `/submit` uses ForumLayout (it's a community/curator action) — or MarketingLayout if
you prefer; flag in your reply if you care.

---

## 6. Files I'll create / modify

**Create:** `pages/start/GatewayPage.tsx`, `pages/start/ToolDeepDivePage.tsx`,
`pages/SubmitDatasetPage.tsx`, `pages/FaqPage.tsx`, `pages/admin/ReviewsPage.tsx`,
`components/start/*` (StepCard, CodeWindow, ScrollSection, ProgressRail, etc.),
`components/FAQAccordion.tsx`, `services/datasetService.ts`,
`content/tutorial.tsx`, `content/faq.ts`, `hooks/useInView.ts` (if needed),
Edge Function `dataset-submission-notify/`, Supabase migration for `curator_submissions`.

**Modify:** `App.tsx` (routes), `pages/QuizPage.tsx` / `components/quiz/QuizResult.tsx`
(CTA), `pages/UserDashboardPage.tsx` (monitor), `types/index.ts` (new types),
`package.json` (add `motion`), nav/footer links.

---

## 7. Execution order (batches)

1. **Batch 1 (foundation, parallel):** install `motion`; Supabase migration
   (`curator_submissions` + RLS + webhook); Edge Function; types + `datasetService`;
   shared start components (StepCard, CodeWindow, ScrollSection, ProgressRail);
   `content/tutorial.tsx`; `content/faq.ts`.
2. **Batch 2 (pages, parallel):** GatewayPage; ToolDeepDivePage; SubmitDatasetPage;
   ReviewsPage; FAQAccordion + FaqPage.
3. **Batch 3 (wiring):** routes in `App.tsx`; QuizResult CTA; UserDashboard monitor;
   nav/footer links.
4. **Batch 4 (validate):** `tsc -b && vite build`, oxlint, advisor/security check,
   manual flow walkthrough.

---

### Your reply
Just answer Q1–Q6 (or say "use all defaults") and I'll start building.
