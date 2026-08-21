# AI Dataset Curation — The 4-Step Pipeline (Telegram Summary)

*Read the full interactive tutorial at* https://loseyourip.com/start *for examples, code snippets, and tool deep dives.*

---

## What You'll Do

AI models learn from clean, structured data. As a curator, you turn messy real-world text into datasets AI can actually use — *no coding required to submit*, but tools help at scale. The 4-step pipeline turns "coffee-stained pages" into clean, machine-ready information.

---

## The 4-Step Pipeline

### Step 1: The Cleaning 🧹
Raw data is like a book covered in coffee stains, scribbles, and old ads — AI can't read it. You'll scrub away noise: HTML code, extra emojis, bad spelling, weird characters, duplicates, and garbage that confuses models.

*What you do*: Remove or fix anything that isn't useful for training.

*Example*: `"OMG!!! i loooove this product... it's sooooo good!!! 😍😍😍 check it out at http://store.com/item123"` → `"I love this product. It is very good."`

*Why*: Clean data means AI learns the right patterns, not the noise.

---

### Step 2: Language Alignment 🌐
If you're building a multilingual AI, you can't just throw random English and Spanish sentences at it. They have to match perfectly — every row in English must have its exact partner in another language. Special characters (ñ, é, ß, 漢) must stay intact.

*What you do*: Verify translation pairs one-to-one, check encoding, and fix misalignments.

*Example*: `"Good morning!"` ↔ `"¡Buenos días!"` ✓ | `"Good morning!"` ↔ `"Hola."` ✗

*Why*: Bad pairs break translation models. Even one wrong pairing confuses the entire system.

---

### Step 3: Structuring the Data 📦
Computers don't like rambling paragraphs. They prefer "labelled jars" — neat, organized boxes where each piece of data has its own place. This means converting raw text into JSON, CSV, or JSONL with consistent fields and IDs.

*What you do*: Organize data into a format machines can read. Each row gets the same columns (user_id, message, timestamp, etc.).

*Example*: `{"user_id": 1, "message": "Hello!", "timestamp": "2023-10-01T10:00:00Z"}`

*Why*: Structured data is faster to load, easier to process, and less error-prone. AI models expect JSON/CSV, not messy text files.

---

### Step 4: Dataset Labelling 🏷️
This is how AI actually learns. You look at a piece of data and give it a tag that becomes the "ground truth" — the correct answer the model should match. Labels teach AI what things *are* (Positive/Negative, Category, Entity).

*What you do*: Add category tags, sentiment labels, or named entities to your data.

*Example*: `"I am so angry!"` → `[Negative]` | `"This is the best day!"` → `[Positive]`

*Why*: Without labels, AI doesn't know what patterns to learn. Labels become the training signal.

---

## The Tools (Optional but Powerful)

### 1. ooguy — LLM Dataset Formatter 🚀
*Best for*: All stages (complete solution). Perfect for beginners and mobile users.
*How*: Telegram Mini App with drag-and-drop nodes. Upload text/images/audio/video → AI cleans, translates, formats, and labels → export JSON/JSONL/CSV.
*Cost*: $10 for 10K credits (75% off for new users). Works on any device.
*Why*: No coding, keeps data private, handles all content types in one place. Get 70-80% off your first dataset.

---

### 2. VS Code + GitHub Copilot 💻
*Best for*: Cleaning, alignment, structuring (Stages 1–3). Scale: millions of rows.
*How*: Write comments like `"# remove all HTML tags and emojis"` → Copilot writes Python code instantly.
*Cost*: VS Code free · Copilot ~$10/mo.
*Why*: Infinite scalability. If you have 10M messy rows, you need code, not clicking. Copilot turns English prompts into working scripts.

---

### 3. Label Studio 🎨
*Best for*: Multimodal labelling (text, images, audio, video). Custom interfaces.
*How*: Upload data, configure labeling UI (checkboxes, bounding boxes, time segments), export JSON/CSV.
*Cost*: Free (open-source) · Enterprise for teams.
*Why*: One tool for everything. Label images with text, tag audio timestamps, annotate video frames — all in one customizable workspace.

---

### 4. Prodigy ⚡
*Best for*: Text-only NLP (sentiment, NER, translation). Active learning.
*How*: Label 50 samples → model trains → AI suggests next 1,000 → you confirm/correct. The loop continues.
*Cost*: Paid licence · 30-day trial.
*Why*: Blazing speed. Active learning reduces the amount you need to label by up to 80%. Best for high-velocity text projects.

---

## How to Submit

1. **Clean your data** (remove noise, duplicates, bad encoding).
2. **Structure it** (JSON/CSV with consistent fields — same columns for every row).
3. **Pick a category** (Jokes, Health, Tech, Education, Business, Entertainment, Science, History, Lifestyle, Sports — or "Other").
4. **Upload** at https://loseyourip.com/submit.

*Partially curated datasets are welcome — a cleaned CSV is better than a messy one, even if not yet labeled or structured.*

---

## Earnings

*500+ entries* → $50 | *1,500+* → $75 | *3,000+* → $100 per approved dataset.

*Referral bonus*: $5 per referral + $100 bonus at 10 referrals.
*Agiel Member bonus*: $100 for submitting first dataset within 24 hours of joining.

*Withdrawal*: Unlocks at $1,200 balance · MoneyGram or Western Union · 3–5 business days.

---

## FAQ — Everything You Need to Know

**Q: What exactly is "dataset curation," and what will I be doing?**

A: Dataset curation is the process of collecting, cleaning, formatting, and (sometimes) labeling raw information so it can be used to train AI models. As a curator, you turn messy, real-world text/data into clean, structured, machine-ready datasets — for example properly formatted JSON or CSV, correctly categorized, and free of noise.

---

**Q: Do I need to know how to code?**

A: No coding is required to submit a dataset. The submission page lets you upload a file and pick a category. If you later want to process data at scale (cleaning thousands of rows, converting formats), the tutorial shows tools like VS Code + GitHub Copilot and ooguy — but those are optional. You can start with a simple, well-organized file.

---

**Q: How does the tutorial apply to my submission?**

A: The tutorial teaches the 4-step dataset pipeline: (1) Cleaning — remove noise, HTML, emojis, and bad spelling; (2) Language Alignment — ensure translation pairs match perfectly; (3) Structuring — organize into JSON/CSV with consistent fields; (4) Labelling — add category tags or labels. Following these steps before submission improves quality and approval odds, but you don't have to complete all 4 — partially curated datasets (e.g., cleaned but not labeled) are welcome.

---

**Q: What file formats can I submit?**

A: We accept `.json`, `.csv`, `.txt`, and `.parquet`. For beginners, CSV and plain text are easiest. JSON is preferred for structured or nested data. File uploads are capped at a generous size limit; very large datasets can also be shared via a link.

---

**Q: How large should each dataset be?**

A: A standard dataset is around 500+ entries (1 row in a CSV = 1 entry; 1 object in JSON = 1 entry; 1 question–answer pair = 1 entry; 1 timestamped transcription segment = 1 entry). There is no strict maximum — larger, high-quality datasets are valued more. Very small submissions may be priced lower or returned with a note to expand.

---

**Q: How much will I get paid, and how is the price decided?**

A: Pricing is tiered by entry count: 500+ entries = $50 (e.g. a spreadsheet of 500 proverbs), 1,500+ = $75 (e.g. 1,500 question–answer pairs), and 3,000+ = $100 (e.g. 3,000 timestamped speech segments) per approved dataset. Once a dataset is approved, the payment is credited straight to your dashboard wallet. Referral rewards ($5 per referral, plus a $100 bonus at 10 referrals) land in the same wallet. Withdrawals unlock at $1,200 and are paid internationally via MoneyGram or Western Union within 3–5 business days.

---

**Q: How long does the review take?**

A: Most submissions are reviewed within 2–5 business days. Complex or very large datasets may take a little longer. You can track status live in your dashboard's Dataset Monitor: Pending → Under Review → Approved / Rejected.

---

**Q: How will I know if my dataset was approved or rejected?**

A: Your dashboard updates in real time. If approved, the proposed price shows next to it. If rejected or needs changes, the reviewer's notes explain exactly why and what to fix so you can resubmit.

---

**Q: What makes a "high-quality" dataset?**

A: Clean, consistent, well-structured, correctly categorized, and genuinely useful for training. Practically: no duplicate or garbage rows, consistent formatting, correct UTF-8 encoding, accurate labels (if labeled), and content that truly matches its chosen category.

---

**Q: Why might a dataset get rejected?**

A: Common reasons: low quality (messy/duplicate/noisy), too small, wrong category, obvious plagiarism or copyright issues, contains private/sensitive personal data, or the file doesn't match its claimed format. Every rejection includes notes so you can fix and resubmit.

---

**Q: Can I submit datasets in my local or native language?**

A: Yes — multilingual and local-language datasets are especially valuable. Just make sure the text is correctly encoded (UTF-8) so special characters (ñ, é, ß, 漢, etc.) don't break. For translation datasets, ensure the source and target rows are perfectly aligned one-to-one — the tutorial's "Language Alignment" step explains how to verify this.

---

**Q: Who owns the dataset after I submit it?**

A: By submitting, you confirm you have the rights to the data and grant LYIP a license to use it for AI training and research. Don't submit copyrighted material you don't have rights to — you'll confirm this at submission time.

---

**Q: Can I use data I scraped or found online?**

A: Only if you have the right to use it. Public-domain data, your own data, or properly licensed data is fine. Data scraped from behind paywalls or copyrighted without permission is not allowed and will be rejected.

---

**Q: What categories can I submit to — and what if mine doesn't fit?**

A: Categories include Jokes/Comedy/Memes, Health & Fitness, Tech & Innovation, Education & Learning, Business & Finance, Entertainment, Science, History & Culture, Lifestyle, and Sports. If none fit, choose "Other" and type your own category.

---

**Q: Is my data and personal information safe?**

A: Your account and submissions are protected by Row-Level Security — only you and authorized reviewers can see your datasets. Never include other people's private/personal information inside the dataset content itself.

---

**Q: What if my dataset has images, audio, or video (multimodal)?**

A: Yes — multimodal datasets are valuable. For multimodal projects (labeling images with text descriptions, tagging audio/video timestamps), the tutorial recommends Label Studio or ooguy because they support all data types in one platform. For text-only datasets (sentiment analysis, NER, translation), Prodigy is more specialized and faster. Choose the tool that fits your data type.

---

**Q: Can I submit partially curated data?**

A: Yes — you don't need to complete all 4 tutorial steps before submitting. A cleaned CSV is better than a messy one, even if it's not yet structured or labeled. The review team will check quality and may ask you to complete missing steps (e.g., "add a category column" or "remove duplicate rows") before approval.

---

**Q: What happens after my dataset is approved?**

A: Approved datasets are added to LYIP's training corpus. Your wallet is credited with the approved amount, and you can track earnings in your dashboard. Once your balance reaches $1,200, you can request a withdrawal via MoneyGram or Western Union. Datasets are never sold — they're used internally for AI research and training, and you retain the rights to use your original data.

---

**Q: How do I get paid after approval?**

A: Earnings go straight to your dashboard wallet. The withdrawal threshold is $1,200. To withdraw, set up your payout details (choose MoneyGram or Western Union, enter recipient name, phone, and address) — these details are saved for future withdrawals. Withdrawals are processed within 3–5 business days.

---

**Q: Does the referral program pay, and how does it work?**

A: Yes — you earn $5 for every referral who submits their first approved dataset. At 10 completed referrals, you unlock a one-time $100 bonus credited to your wallet. Share your unique referral link from the dashboard to get started.

---

**Q: What is the Agiel Member bonus?**

A: If you submit your first dataset within 24 hours of joining, you earn an extra $100 bonus credited to your wallet immediately upon approval. This is a one-time new-user incentive.

---

**Q: Can I edit my submission after it's marked "needs changes"?**

A: Yes — when your dataset is rejected or marked for changes, you can reupload a revised file with the same or updated metadata. The review notes tell you exactly what to fix. Resubmitted datasets are reviewed again — there's no penalty for fixing and resubmitting.

---

**Q: Where do I go if I still have questions?**

A: Check the tutorial for step-by-step guidance on data cleaning, alignment, structuring, and labelling. If the tutorial and FAQ don't cover your question, visit https://loseyourip.com/contact to send us a message — our team responds within 1–2 business days. You can also join the community forum to ask other curators and share tips.

---

**Q: What should a properly formatted dataset look like?**

A: The tutorial shows examples. For JSON, use consistent keys (e.g., `{"user_id": 1, "message": "Hello!", "timestamp": "2023-10-01T10:00:00Z"}`). For CSV, each column should be a field (e.g., `user_id,message,timestamp`) with no empty or malformed rows. Structured, machine-readable formats are approved faster.

---

*Start submitting at https://loseyourip.com/submit · Full tutorial at https://loseyourip.com/start*