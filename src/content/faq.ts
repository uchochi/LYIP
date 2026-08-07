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
    q: 'What file formats can I submit?',
    a: 'We accept .json, .csv, .txt, and .parquet. For beginners, CSV and plain text are easiest. JSON is preferred for structured or nested data. File uploads are capped at a generous size limit; very large datasets can also be shared via a link.',
  },
  {
    q: 'How large should each dataset be?',
    a: 'A standard dataset is around 1,500+ words (or the equivalent number of rows). There is no strict maximum — larger, high-quality datasets are valued more. Very small submissions may be priced lower or returned with a note to expand.',
  },
  {
    q: 'How much will I get paid, and how is the price decided?',
    a: 'Indicative pricing is roughly $50–$100 per dataset (1,500+ words). The exact amount is proposed by our review team based on category, size, quality, cleanliness, and usefulness. Once a dataset is approved, the proposed price appears in your dashboard, and your total earned updates automatically. Payout timing follows your curator role agreement.',
  },
  {
    q: 'How long does the review take?',
    a: 'Most submissions are reviewed within 2–5 business days. Complex or very large datasets may take a little longer. You can track status live in your dashboard’s Dataset Monitor: Pending → Under Review → Approved / Rejected.',
  },
  {
    q: 'How will I know if my dataset was approved or rejected?',
    a: 'Your dashboard updates in real time. If approved, the proposed price shows next to it. If rejected or needs changes, the reviewer’s notes explain exactly why and what to fix so you can resubmit.',
  },
  {
    q: 'What makes a "high-quality" dataset?',
    a: 'Clean, consistent, well-structured, correctly categorized, and genuinely useful for training. Practically: no duplicate or garbage rows, consistent formatting, correct UTF-8 encoding, accurate labels (if labeled), and content that truly matches its chosen category.',
  },
  {
    q: 'Why might a dataset get rejected?',
    a: 'Common reasons: low quality (messy/duplicate/noisy), too small, wrong category, obvious plagiarism or copyright issues, contains private/sensitive personal data, or the file doesn’t match its claimed format. Every rejection includes notes so you can fix and resubmit.',
  },
  {
    q: 'Can I submit datasets in my local or native language?',
    a: 'Yes — multilingual and local-language datasets are especially valuable. Just make sure the text is correctly encoded (UTF-8) and, for translation datasets, that the source and target rows are perfectly aligned one-to-one.',
  },
  {
    q: 'Who owns the dataset after I submit it?',
    a: 'By submitting, you confirm you have the rights to the data and grant LYIP a license to use it for AI training and research. Don’t submit copyrighted material you don’t have rights to — you’ll confirm this at submission time.',
  },
  {
    q: 'Can I use data I scraped or found online?',
    a: 'Only if you have the right to use it. Public-domain data, your own data, or properly licensed data is fine. Data scraped from behind paywalls or copyrighted without permission is not allowed and will be rejected.',
  },
  {
    q: 'What categories can I submit to — and what if mine doesn’t fit?',
    a: 'Categories include Jokes/Comedy/Memes, Health & Fitness, Tech & Innovation, Education & Learning, Business & Finance, Entertainment, Science, History & Culture, Lifestyle, and Sports. If none fit, choose "Other" and type your own category.',
  },
  {
    q: 'Is my data and personal information safe?',
    a: 'Your account and submissions are protected by Row-Level Security — only you and authorized reviewers can see your datasets. Never include other people’s private/personal information inside the dataset content itself.',
  },
];
