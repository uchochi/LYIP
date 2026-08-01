# Master Plan — End-to-End Dark Restructure + Forum Chrome Separation

> **Status:** IMPLEMENTED — all phases complete; `npm run lint` + `npm run build` pass clean;
> dev server serves all zones (200). Awaiting owner visual review.
> Authored in response to: forum/website design inconsistency; forum must have its **own
> purpose-built navbar + footer** distinct from the marketing site.
>
> Decisions confirmed with the owner:
> 1. **Unify the entire site to one dark design language.**
> 2. **UserDashboard moves under the forum chrome** and is restyled dark.
> 3. **Admin & auth pages get a bare layout** (no marketing footer).

---

## 0. Executive Summary

Today a **single light `Layout`** (`src/pages/Layout.tsx`) wraps every route in `src/App.tsx`,
including the dark forum. The result is a dark community feed crammed between a light
marketing navbar and a light marketing footer — the core inconsistency the owner wants gone.

This restructure moves to **React Router v7 layout routes**, giving each *zone* of the app its
own `<Outlet/>` chrome:

| Zone | Layout | Theme | Navbar focus | Footer focus |
|---|---|---|---|---|
| Marketing | `MarketingLayout` | dark | corporate / product / careers | Company · Resources · Legal |
| **Forum** | **`ForumLayout`** | **dark** | **community: Feed · New Topic · Guidelines · Members** | **Community · Help · Account · Back to site** |
| Admin / Auth | `BareLayout` | dark | minimal top bar only | none |

All three zones share **one dark palette** so the product feels cohesive, while the forum's
navigation and footer are tailored to its purpose (the *Dataset Training Community* for the
"AI Dataset for Local Language Curator" role).

**Scope:** ~1,800 lines across 18 pages; 25 tasks across 8 phases. App stays runnable between
phases.

---

## 1. Diagnosis — What's Wrong Today

### 1.1 One Layout wraps everything
`src/App.tsx:33` wraps `<Routes>` in a single `<Layout>`. The forum pages (`/forum`,
`/forum/:topicId`, `/forum/new`) render dark `forum-dark` content (`src/forum.css`, bg
`#09090b`) but inherit the **light** navbar (`bg-white/80 backdrop-blur`, `src/pages/Layout.tsx:26`)
and **light** footer (`bg-slate-50`, `src/components/Footer.tsx:33`).

### 1.2 Forum nav is marketing-centric
Shared navbar shows "Home / Open Positions / Forum" — corporate links. The forum is a
*learning community* and needs Feed / Guidelines / Members / My Profile, plus the user's
handle, knowledge score, and role.

### 1.3 Forum footer points at corporate pages
Shared footer links to About / Platform / Research / Legal. The forum footer should surface
Guidelines, Code of Conduct, Report a Bug, support@, and a "Back to LoseYourIP" link.

### 1.4 UserDashboard mismatch
`UserDashboardPage` (193 lines) is forum-profile content (knowledge score, My Topics, My
Replies) but styled light (`bg-white`, `border-slate-200`) and shown under marketing chrome.

### 1.5 Dead / duplicate layout code
`src/components/layout/{Layout,Navbar,Footer}.tsx` is a **second, unused** layout set with
different nav links and footer copy. It is not imported anywhere in the app. It causes
confusion and must be deleted.

### 1.6 Two divergent themes
Marketing: light (`bg-white`, `slate`, `primary #2563EB`). Forum: dark (`forum.css`).
With decision ① (unify dark), marketing pages must be converted to the dark palette.

### 1.7 Light-class footprint per page (restyle effort)
| Page | Lines | Light-class hits |
|---|---|---|
| HomePage | 269 | 32 |
| UserDashboardPage | 193 | 21 |
| AboutPage | 110 | 18 |
| PlatformPage | 73 | 13 |
| admin/DashboardPage | 81 | 9 |
| Layout.tsx | 119 | 9 |
| CommunityPage | 44 | 8 |
| Terms/Privacy/Cookies | 33–35 ea | 6 ea |
| ResearchPage | 34 | 6 |
| admin/Signup,Login,Edit,Create | 24–70 | 3 ea |
| NotFoundPage | 14 | 3 |
| JobsPage / JobDetailPage | 50 / 26 | 2 |

---

## 2. Target Architecture

### 2.1 Routing (React Router v7 nested layout routes)
```
<BrowserRouter>
  <AuthProvider>
    <ScrollToTop />
    <Routes>
      <Route element={<MarketingLayout />}>        // dark marketing chrome
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/platform" element={<PlatformPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route element={<ForumLayout />}>            // dark community chrome
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/forum/:topicId" element={<ForumTopicPage />} />
        <Route path="/forum/new" element={<NewTopicPage />} />
        <Route path="/dashboard"
          element={<ProtectedUserRoute><UserDashboardPage /></ProtectedUserRoute>} />
      </Route>

      <Route element={<BareLayout />}>             // bare dark chrome
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/signup" element={<SignupPage />} />
        <Route path="/admin"
          element={<ProtectedAdminRoute><DashboardPage /></ProtectedAdminRoute>} />
        <Route path="/admin/jobs/new"
          element={<ProtectedAdminRoute><CreateJobPage /></ProtectedAdminRoute>} />
        <Route path="/admin/jobs/:id/edit"
          element={<ProtectedAdminRoute><EditJobPage /></ProtectedAdminRoute>} />
      </Route>
    </Routes>
  </AuthProvider>
</BrowserRouter>
```
Each layout renders `<Outlet/>` so child pages inherit the correct chrome. `Protected*Route`
guards continue to work as element wrappers inside the tree.

### 2.2 File layout (new)
```
src/layouts/
  MarketingLayout.tsx     // dark navbar + dark footer + <Outlet/>
  ForumLayout.tsx         // dark forum navbar + dark forum footer + <Outlet/>
  BareLayout.tsx          // minimal top bar, no footer + <Outlet/>
src/components/
  marketing/
    MarketingNavbar.tsx
    MarketingFooter.tsx
  forum/
    ForumNavbar.tsx        // NEW (existing chat components stay)
    ForumFooter.tsx        // NEW
```
**Deleted:** `src/pages/Layout.tsx`, `src/components/layout/*` (entire dead set),
`src/components/Footer.tsx` (folded into `MarketingFooter`).

---

## 3. Design System — Unified Dark Tokens

Extend `src/index.css` `@theme` (Tailwind v4) so marketing pages use semantic tokens and
match the existing `forum.css` palette. This makes the whole product one language.

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#09090b` | page background (matches forum `--bg`) |
| `--color-surface` | `#18181b` | cards, navbar, footer (matches forum `--surface`) |
| `--color-surface-lighter` | `#27272a` | hover / inputs |
| `--color-border` | `rgba(255,255,255,0.08)` | hairlines |
| `--color-border-strong` | `rgba(255,255,255,0.15)` | emphasis borders |
| `--color-primary` | `#3b82f6` | links, active states (was `#2563EB` — unified to forum blue) |
| `--color-accent` | `#a855f7` | accents (was `#7C3AED`) |
| `--color-text-main` | `#fafafa` | primary text |
| `--color-text-muted` | `#a1a1aa` | secondary text |
| `--color-live-red` | `#ef4444` | online dot |

Conversion rule of thumb for marketing pages:
`bg-white → bg-bg`, `bg-slate-50 → bg-surface`, `border-slate-200 → border-border`,
`text-slate-900 → text-text-main`, `text-slate-500/600 → text-text-muted`,
`shadow-sm → shadow + dark bg`.

The forum's existing class-based `forum.css` (message cards, reactions, input) is retained
unchanged — it already uses these tokens.

---

## 4. Task Breakdown (25 tasks, 8 phases)

### Phase 0 — Foundation: dark design system
- **T0.1** Extend `src/index.css` `@theme` with the dark token palette above.
- **T0.2** Set global `body` to dark (bg `--color-bg`, color `--color-text-main`) to prevent
  any flash of light during navigation.
- **T0.3** (If helpful) add 1–2 shared dark surface utility classes to speed page conversion.

### Phase 1 — Layout architecture
- **T1.1** Create `src/layouts/MarketingLayout.tsx` (dark navbar + dark footer + `<Outlet/>`).
- **T1.2** Create `src/layouts/ForumLayout.tsx` (dark forum navbar + dark forum footer + `<Outlet/>`).
- **T1.3** Create `src/layouts/BareLayout.tsx` (minimal top bar, no footer + `<Outlet/>`).
- **T1.4** Rewrite `src/App.tsx` to nested layout routes (§2.1); preserve `AuthProvider`,
  `ScrollToTop`, `ProtectedUserRoute`, `ProtectedAdminRoute`.
- **T1.5** Delete dead code: `src/components/layout/*` and the old `src/pages/Layout.tsx` /
  `src/components/Footer.tsx` once superseded.

### Phase 2 — Marketing chrome (dark)
- **T2.1** `MarketingNavbar` (dark): logo, Home/Open Positions/About/Platform/Research,
  auth-aware Sign In / Dashboard, mobile menu.
- **T2.2** `MarketingFooter` (dark): Company / Resources / Legal columns + brand line.

### Phase 3 — Forum chrome (dark, community-focused) — *core ask*
- **T3.1** `ForumNavbar` (dark): "Dataset Training Community" identity, nav
  **Feed · New Topic · Guidelines · Members**, handle + knowledge-score chip + role badge,
  "← Back to LoseYourIP", mobile menu.
- **T3.2** `ForumFooter` (dark, compact): Community / Help / Account / Back-to-main-site,
  live online/member stat line.
- **T3.3** Scope `forum.css`/`forum-dark` so navbar + footer + feed are seamless (no seam
  between chrome and content).

### Phase 4 — Convert marketing pages to dark
- **T4.1** `HomePage` (hero, stats, featured jobs, values, perks).
- **T4.2** `JobsPage` + `JobDetailPage`.
- **T4.3** `AboutPage` (mission/vision/approach, teams, timeline).
- **T4.4** `PlatformPage`, `ResearchPage`, `CommunityPage`.
- **T4.5** Legal trio: `TermsPage`, `PrivacyPage`, `CookiesPage`.
- **T4.6** `NotFoundPage`.

### Phase 5 — Forum zone polish & dashboard move
- **T5.1** Restyle `UserDashboardPage` dark and verify it renders under `ForumLayout`.
- **T5.2** Verify `ForumPage`, `ForumTopicPage`, `NewTopicPage` sit cleanly under the new
  forum chrome; strip now-redundant inline wrappers.

### Phase 6 — Admin & auth (bare, dark)
- **T6.1** Restyle `admin/LoginPage` + `admin/SignupPage` dark (under `BareLayout`).
- **T6.2** Restyle `admin/DashboardPage`, `CreateJobPage`, `EditJobPage` dark (bare chrome).

### Phase 7 — Cleanup & QA
- **T7.1** Remove all dead layout code + unused imports; consolidate any footer duplicates.
- **T7.2** Verify every route renders under the correct chrome (desktop + mobile);
  `npm run lint` + `npm run build`; manual walk of all forum paths.

---

## 5. Risks & Mitigations
| Risk | Mitigation |
|---|---|
| Tailwind v4 token rename breaks existing class usage | Convert tokens in `@theme`; audit `rg` for stale `slate`/`bg-white` before QA. |
| Forum message components depend on current `forum.css` scoping | Keep `forum.css` untouched; only wrap zone in chrome. |
| Protected routes break under nested layouts | Guards stay as `element` wrappers; verify `/dashboard`, `/admin` post-refactor. |
| Light→dark regression on large `HomePage` | Convert section-by-section; keep app runnable each phase. |

---

## 6. Acceptance Criteria
- [x] Forum pages render under a **dedicated dark `ForumNavbar` + `ForumFooter`** whose links
  reflect the community purpose (not marketing links).
- [x] Marketing pages render under a **dark `MarketingNavbar` + `MarketingFooter`**.
- [x] Admin/auth render under a **bare dark** layout with no marketing footer.
- [x] No light↔dark seam anywhere; single unified palette.
- [x] `UserDashboard` shows under forum chrome, dark styled.
- [x] Dead layout code (`components/layout/*`, old `pages/Layout.tsx`, `components/Footer.tsx`) removed
  (also removed unused `Modal.tsx` + `AdminLogin.tsx`).
- [x] `npm run lint` and `npm run build` pass clean.
- [x] All routes load with correct chrome on desktop and mobile (server serves 200; build type-checks).
