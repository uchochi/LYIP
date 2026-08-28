export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Dataset-curation FAQ for new curators.
 * Source of truth lives in /FAQ_DATASET_CURATION.md — keep these in sync
 * after the editorial review.
 */
export const DATASET_FAQS: FaqItem[] = [
  {
    q: 'What exactly is "dataset curation," and what will I be doing?',
    a: 'Dataset curation is the process of collecting, cleaning, formatting, and (sometimes) labeling raw information so it can be used to train AI models. As a curator, you turn messy, real-world text/data into clean, structured, machine-ready datasets — for example properly formatted JSON or CSV, correctly categorized, and free of noise.',
  },
  {
    q: 'Do I need to know how to code?',
    a: 'No coding is required to submit a dataset. The submission page lets you upload a file and pick a category. If you later want to process data at scale (cleaning thousands of rows, converting formats), the tutorial shows tools like VS Code + GitHub Copilot — but those are optional. You can start with a simple, well-organized file.',
  },
  {
    q: 'How does the tutorial apply to my submission?',
    a: 'The tutorial teaches the 4-step dataset pipeline: (1) Cleaning — remove noise, HTML, emojis, and bad spelling; (2) Language Alignment — ensure translation pairs match perfectly; (3) Structuring — organize into JSON/CSV with consistent fields; (4) Labelling — add category tags or labels. Following these steps before submission improves quality and approval odds, but you don\'t have to complete all 4 — partially curated datasets (e.g., cleaned but not labeled) are welcome.',
  },
  {
    q: 'What file formats can I submit?',
    a: 'We accept `.json`, `.csv`, `.txt`, and `.parquet`. For beginners, CSV and plain text are easiest. JSON is preferred for structured or nested data. File uploads are capped at a generous size limit; very large datasets can also be shared via a link.',
  },
  {
    q: 'How large should each dataset be?',
    a: 'A standard dataset is around 500+ entries (1 row in a CSV = 1 entry; 1 object in JSON = 1 entry; 1 question–answer pair = 1 entry; 1 timestamped transcription segment = 1 entry). There is no strict maximum — larger, high-quality datasets are valued more. Very small submissions may be priced lower or returned with a note to expand.',
  },
  {
    q: 'How much will I get paid, and how is the price decided?',
    a: 'Pricing is tiered by entry count: 500+ entries = $50 (e.g. a spreadsheet of 500 proverbs), 1,500+ = $75 (e.g. 1,500 question–answer pairs), and 3,000+ = $100 (e.g. 3,000 timestamped speech segments) per approved dataset. Once a dataset is approved, the payment is credited straight to your dashboard wallet. Referral rewards ($5 per referral, plus a $50 bonus for every 10 completed referrals — unlimited) land in the same wallet. Withdrawals unlock at $1,200 and are paid internationally via MoneyGram or Western Union within 3–5 business days.',
  },
  {
    q: 'How long does the review take?',
    a: 'Most submissions are reviewed within 2–5 business days. Complex or very large datasets may take a little longer. You can track status live in your dashboard\'s Dataset Monitor: Pending → Under Review → Approved / Rejected.',
  },
  {
    q: 'How will I know if my dataset was approved or rejected?',
    a: 'Your dashboard updates in real time. If approved, the proposed price shows next to it. If rejected or needs changes, the reviewer\'s notes explain exactly why and what to fix so you can resubmit.',
  },
  {
    q: 'What makes a "high-quality" dataset?',
    a: 'Clean, consistent, well-structured, correctly categorized, and genuinely useful for training. Practically: no duplicate or garbage rows, consistent formatting, correct UTF-8 encoding, accurate labels (if labeled), and content that truly matches its chosen category.',
  },
  {
    q: 'Why might a dataset get rejected?',
    a: 'Common reasons: low quality (messy/duplicate/noisy), too small, wrong category, obvious plagiarism or copyright issues, contains private/sensitive personal data, or the file doesn\'t match its claimed format. Every rejection includes notes so you can fix and resubmit.',
  },
  {
    q: 'Can I submit datasets in my local or native language?',
    a: 'Yes — multilingual and local-language datasets are especially valuable. Just make sure the text is correctly encoded (UTF-8) so special characters (ñ, é, ß, 漢, etc.) don\'t break. For translation datasets, ensure the source and target rows are perfectly aligned one-to-one — the tutorial\'s "Language Alignment" step explains how to verify this.',
  },
  {
    q: 'Who owns the dataset after I submit it?',
    a: 'By submitting, you confirm you have the rights to the data and grant LYIP a license to use it for AI training and research. Don\'t submit copyrighted material you don\'t have rights to — you\'ll confirm this at submission time.',
  },
  {
    q: 'Can I use data I scraped or found online?',
    a: 'Only if you have the right to use it. Public-domain data, your own data, or properly licensed data is fine. Data scraped from behind paywalls or copyrighted without permission is not allowed and will be rejected.',
  },
  {
    q: 'What categories can I submit to — and what if mine doesn\'t fit?',
    a: 'Categories include Jokes/Comedy/Memes, Health & Fitness, Tech & Innovation, Education & Learning, Business & Finance, Entertainment, Science, History & Culture, Lifestyle, and Sports. If none fit, choose "Other" and type your own category.',
  },
  {
    q: 'Is my data and personal information safe?',
    a: 'Your account and submissions are protected by Row-Level Security — only you and authorized reviewers can see your datasets. Never include other people\'s private/personal information inside the dataset content itself.',
  },
  {
    q: 'What if my dataset has images, audio, or video (multimodal)?',
    a: 'Yes — multimodal datasets are valuable. For multimodal projects (labeling images with text descriptions, tagging audio/video timestamps), the tutorial recommends Label Studio because it supports all data types in one platform. For text-only datasets (sentiment analysis, NER, translation), Prodigy is more specialized and faster. Choose the tool that fits your data type — both are covered in the tutorial deep dives.',
  },
  {
    q: 'Can I submit partially curated data?',
    a: 'Yes — you don\'t need to complete all 4 tutorial steps before submitting. A cleaned CSV is better than a messy one, even if it\'s not yet structured or labeled. The review team will check quality and may ask you to complete missing steps (e.g., "add a category column" or "remove duplicate rows") before approval.',
  },
  {
    q: 'What happens after my dataset is approved?',
    a: 'Approved datasets are added to LYIP\'s training corpus. Your wallet is credited with the approved amount, and you can track earnings in your dashboard. Once your balance reaches $1,200, you can request a withdrawal via MoneyGram or Western Union. Datasets are never sold — they\'re used internally for AI research and training, and you retain the rights to use your original data.',
  },
  {
    q: 'How do I get paid after approval?',
    a: 'Earnings go straight to your dashboard wallet. The withdrawal threshold is $1,200. To withdraw, set up your payout details (choose MoneyGram or Western Union, enter recipient name, phone, and address) — these details are saved for future withdrawals. Withdrawals are processed within 3–5 business days.',
  },
  {
    q: 'Does the referral program pay, and how does it work?',
    a: 'Yes — you earn $5 for every referral who submits their first dataset, plus a $50 milestone bonus for every 10 completed referrals (10, 20, 30 — with no limit), credited automatically to your wallet. Share your unique referral link from the dashboard to get started, or see the Referral Program page for the full breakdown.',
  },
  {
    q: 'What is the Agiel Member bonus?',
    a: 'If you submit your first dataset within 24 hours of joining, you earn an extra $100 bonus credited to your wallet immediately upon approval. This is a one-time new-user incentive.',
  },
  {
    q: 'Can I edit my submission after it\'s marked "needs changes"?',
    a: 'Yes — when your dataset is rejected or marked for changes, you can reupload a revised file with the same or updated metadata. The review notes tell you exactly what to fix. Resubmitted datasets are reviewed again — there\'s no penalty for fixing and resubmitting.',
  },
  {
    q: 'Where do I go if I still have questions?',
    a: 'Check the tutorial for step-by-step guidance on data cleaning, alignment, structuring, and labelling. If the tutorial and FAQ don\'t cover your question, email us at support@loseyourip.com — our team responds within 1–2 business days. You can also join the community forum to ask other curators and share tips.',
  },
  {
    q: 'What should a properly formatted dataset look like?',
    a: 'The tutorial shows examples. For JSON, use consistent keys (e.g., `{"user_id": 1, "message": "Hello!", "timestamp": "2023-10-01T10:00:00Z"}`). For CSV, each column should be a field (e.g., `user_id,message,timestamp`) with no empty or malformed rows. Structured, machine-readable formats are approved faster.',
  },
];