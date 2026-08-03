# Forum Upgrades — Implementation Plan

Session: 2026-08-03
Status: in_progress

---

## Task 1: Dataset Submission Button

| Subtask | Description |
|---|---|
| **1a** | Add `has_dataset_submit BOOLEAN DEFAULT false` to `forum_topics` (Supabase migration) |
| **1b** | Add checkbox toggle on NewTopicPage: "Enable dataset submissions" (visible to admin/moderator only) |
| **1c** | Create `dataset_submissions` table: `id`, `topic_id`, `user_id`, `title`, `content`, `url`, `file_url`, `status`, `admin_notes`, timestamps. RLS: public read per topic, auth insert, admin manage |
| **1d** | On ForumTopicPage: if `topic.has_dataset_submit`, render "Submit Dataset" button → opens inline form modal |
| **1e** | Render submitted datasets below the topic with status badges, admin approve/reject actions |

---

## Task 2: Fun Forum Vibe

| Subtask | Description |
|---|---|
| **2a** | Update placeholder text (ChatInput: "Drop your hot take, dataset, or wisdom...", NewTopic: more energetic copy) |
| **2b** | Add "🔥 Hot" badge on topics with >5 replies or >10 reactions |
| **2c** | ReactionBar: add more emojis (🎉, 💡, 👏, 🧠), smooth CSS hover/scale animations |
| **2d** | Post cards: subtle gradient left-border on new posts, better visual hierarchy |
| **2e** | Rename "Post Update" → "Drop It 🚀", "Creating..." → "Launching..." |
| **2f** | Add "Top Contributors This Week" sidebar on ForumPage (avatar wall from DB query) |

---

## Task 3: Global Forum (not Africa-only)

| Subtask | Description |
|---|---|
| **3a** | Rename forum heading from "AI Dataset for Local Language Curator" → "Global Dataset Training Community" |
| **3b** | Update `accounts.json`: 100 global names (Indian, Chinese, Brazilian, Russian, Japanese, Korean, Arabic…). Mods keep Euro/American. |
| **3c** | Update `~/.hermes/SOUL.md`: remove Africa-only slang, add global casual style notes |
| **3d** | Update forum copy on ForumLayout / CommunityHeader to be globally inclusive |
| **3e** | Add optional `region` tag to NewTopicPage (dropdown: Africa, Asia, Europe, Americas, Oceania, Global) |

---

## Task 4: Slim Footer

| Subtask | Description |
|---|---|
| **4a** | Redesign ForumFooter: single line, `py-3`, horizontal layout |
| **4b** | Content: `© 2026 LoseYourIP · Privacy · Terms · Cookies` |
| **4c** | Remove grid, columns, descriptions, extra links |

---

## Task 5: Fix Counters (real data from DB)

| Subtask | Description |
|---|---|
| **5a** | **Views**: `view_count INTEGER DEFAULT 0` on `forum_topics`. RPC `increment_topic_view(topic_id)` with user-session dedup. Call on mount. |
| **5b** | **Members**: `115000 + COUNT(*) FROM users`. No `+1850` hardcode. Fresh signups add 1. |
| **5c** | **Online**: Add `last_seen_at TIMESTAMPTZ` to `users`. Heartbeat on page visit. `random(3000,10000) + COUNT WHERE last_seen_at > now() - 5 min`. |
| **5d** | **Reactions/Replies**: Verify real-time subscriptions work, counts are live. |
| **5e** | Update `CommunityHeader.tsx` and `ForumPage.tsx` to use new real-time queries. |
