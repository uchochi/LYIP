/**
 * Tutorial content for the dataset-curation learning experience.
 *
 * Source of truth: AA.md (gateway — the 4-step pipeline) + AB.md (deep dives).
 * Copy is kept friendly and beginner-oriented to match the source material;
 * only obvious typos have been polished. Pages consume this typed data so the
 * presentation stays separate from the writing.
 */

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface CodeSnippet {
  title: string;
  lang: 'json' | 'text' | 'bash';
  code: string;
}

// ---------------------------------------------------------------------------
// Gateway pipeline (AA.md) — the 4 steps + visual examples
// ---------------------------------------------------------------------------

/** A single before/after contrast pair shown as two stacked mini panels. */
export interface ContrastPair {
  beforeLabel: string;
  before: string;
  afterLabel: string;
  after: string;
}

/** An alignment row used in the language-matching table. */
export interface AlignRow {
  a: string;
  b: string;
  ok: boolean;
}

/** A labelled example chip used in the labelling step. */
export interface LabelExample {
  text: string;
  label: string;
  tone: 'pos' | 'neg' | 'neutral';
}

export type StepVisual =
  | { kind: 'contrast'; pair: ContrastPair }
  | { kind: 'align'; headers: [string, string]; rows: AlignRow[] }
  | { kind: 'code'; snippet: CodeSnippet }
  | { kind: 'labels'; examples: LabelExample[] };

export interface PipelineStep {
  id: string;
  n: number;
  emoji: string;
  title: string;
  /** The one-line goal, shown as a highlight. */
  goal: string;
  /** Accent hex colour for this step (glow, number badge, chips). */
  accent: string;
  /** The analogy / explanation paragraph. */
  intro: string;
  /** Optional reassuring closer. */
  insight?: string;
  visual: StepVisual;
}

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'step-1',
    n: 1,
    emoji: '🧹',
    title: 'The Cleaning',
    goal: 'Turn messy data full of noise into clean, useful information.',
    accent: '#3b82f6',
    intro:
      'Imagine you are trying to read a book, but every page is covered in coffee stains, random scribbles, and old advertisements. You would struggle to learn anything! Raw data is exactly like that. It has weird website code, extra emojis, and bad spelling that confuse the AI. In this step, we use tools to scrub the data until only the important words are left.',
    insight:
      'You will not clean millions of sentences by hand. We will show you tools that do this work in seconds.',
    visual: {
      kind: 'contrast',
      pair: {
        beforeLabel: 'Messy raw data',
        before:
          "OMG!!! i loooove this product... it's sooooo good!!! 😍😍😍 check it out at http://store.com/item123 & check it out at http://site.com/xyz",
        afterLabel: 'Clean data',
        after: 'I love this product. It is very good.',
      },
    },
  },
  {
    id: 'step-2',
    n: 2,
    emoji: '🌐',
    title: 'The Language Alignment',
    goal: 'Make sure the AI can use different languages to tell the same story.',
    accent: '#a855f7',
    intro:
      'If you want to build an AI that speaks both English and Spanish, you cannot just give it random English sentences and random Spanish sentences. They have to match! If the English line is "The sky is blue," the Spanish pair must be "El cielo es azul." We use alignment tools to make sure every single row has a perfect, matching partner — and that special characters like ñ or é do not turn into weird symbols.',
    insight: 'If the pairs are even slightly off, the AI starts translating incorrectly and the system breaks.',
    visual: {
      kind: 'align',
      headers: ['English', 'Spanish'],
      rows: [
        { a: 'Good morning!', b: 'Hola.', ok: false },
        { a: 'Good morning!', b: '¡Buenos días!', ok: true },
        { a: 'The sky is blue', b: 'El cielo es azul', ok: true },
      ],
    },
  },
  {
    id: 'step-3',
    n: 3,
    emoji: '📦',
    title: 'Structuring the Data',
    goal: 'Put information into a structure that computers can actually read.',
    accent: '#22d3ee',
    intro:
      'Computers are picky. They do not like long, rambling paragraphs of text. They like structured data — a fancy way of saying "data that lives in neat boxes." Think of it like a kitchen: if you throw flour, sugar, salt, and eggs into one big container, you cannot cook. But if you put them in labelled jars on a shelf, you can cook perfectly every time.',
    insight: 'JSON is the most popular "labelled jar" format for AI datasets.',
    visual: {
      kind: 'code',
      snippet: {
        title: 'messages.json',
        lang: 'json',
        code: `[
  { "user_id": 1, "message": "Hello!",            "timestamp": "2023-10-01T10:00:00Z" },
  { "user_id": 2, "message": "Hi, how are you?",  "timestamp": "2023-10-01T10:05:00Z" }
]`,
      },
    },
  },
  {
    id: 'step-4',
    n: 4,
    emoji: '🏷️',
    title: 'Dataset Labelling',
    goal: 'Tell the AI exactly what it is looking at.',
    accent: '#34d399',
    intro:
      'This is the most important part of your job — this is where you teach the AI. If you show an AI a thousand pictures of cats but never tell it "this is a cat," it will never learn what a cat is. We call this labelling or "ground-truthing." You look at a piece of data and give it a tag that becomes the truth the AI learns from.',
    insight:
      'You will not label everything yourself. Smart-labelling tools use AI to help you do the work 10x faster.',
    visual: {
      kind: 'labels',
      examples: [
        { text: 'I am so angry about this delay!', label: 'Negative', tone: 'neg' },
        { text: 'This is the best day ever!', label: 'Positive', tone: 'pos' },
        { text: 'The meeting is at 3pm.', label: 'Neutral', tone: 'neutral' },
      ],
    },
  },
];

// ---------------------------------------------------------------------------
// Tool deep dives (AB.md) — one page per tool
// ---------------------------------------------------------------------------

export interface ToolStep {
  title: string;
  body: string;
}

export interface PricingCard {
  label: string;
  value: string;
  note?: string;
}

/** A bold lead-in plus its detail — mirrors the AA.md bullet style. */
export interface ToolkitPoint {
  lead: string;
  detail: string;
}

/**
 * The gateway-level breakdown of a tool (AA.md "Super-Power Toolkit").
 * Kept distinct from the deep-dive content (AB.md) so the gateway stays
 * a concise overview that still links into the full guide.
 */
export interface ToolkitBreakdown {
  /** AA.md role subtitle, e.g. "The Engineering Command Center". */
  subtitle: string;
  intro: string;
  stages: ToolkitPoint[];
  whenToUse: string;
  pros: ToolkitPoint[];
  cons: ToolkitPoint[];
  investment: ToolkitPoint[];
}

export interface ToolDeepDive {
  slug: string;
  name: string;
  emoji: string;
  /** Screenshot/logo served from /public, shown in the toolkit + deep dive hero. */
  image: string;
  /** Short role tag, e.g. "The AI-Powered Developer's Toolkit". */
  role: string;
  /** One-line italic tagline under the title. */
  tagline: string;
  accent: string;
  /** Gateway-level breakdown (AA.md toolkit section). */
  toolkit: ToolkitBreakdown;
  /** Which stages / use-case it fits best (pill on the card). */
  bestFor: string;
  intro: string;
  setup: { title: string; steps: ToolStep[] };
  usage: { title: string; steps: ToolStep[] };
  pricing: { trialNote?: string; cards: PricingCard[] };
  canDo: string[];
  cantDo: string[];
  summaryHeaders: string[];
  summary: { feature: string; cols: string[] }[];
  bottomLine: string;
}

export const TOOL_DEEP_DIVES: ToolDeepDive[] = [
  {
    slug: 'vscode-copilot',
    name: 'VS Code & GitHub Copilot',
    emoji: '💻',
    image: '/VScode_CoPilote.png',
    role: "The AI-Powered Developer's Toolkit",
    tagline: 'Your workbench for cleaning and structuring data at scale.',
    accent: '#3b82f6',
    toolkit: {
      subtitle: 'The Engineering Command Center',
      intro: 'This is the foundational tool. This is the tool that moves and transforms the data.',
      stages: [
        { lead: 'Stage 1 (The Cleaning Of The Dataset)', detail: 'Writing regex and cleaning scripts.' },
        { lead: 'Stage 2 (Language Alignment)', detail: 'Scripting translation pipelines and encoding checks.' },
        {
          lead: 'Stage 3 (Structuring the Data)',
          detail: 'The core stage. Building the logic that converts raw files into structured JSON/Parquet.',
        },
      ],
      whenToUse:
        'Use this when you are dealing with scale. If you have 10 million rows of messy text, you do not open a labeling tool; you open VS Code. You use GitHub Copilot to rapidly write Python/Pandas scripts that "sweep" through the data, removing noise (Stage 1) and enforcing the mathematical structure (Stage 3).',
      pros: [
        { lead: 'Infinite Scalability', detail: 'Code can process terabytes of data that no human interface could ever load.' },
        { lead: 'Precision', detail: 'You can write exact logic for every edge case.' },
      ],
      cons: [
        { lead: 'High Barrier to Entry', detail: 'Requires proficiency in Python or similar languages.' },
        { lead: 'Logic Risk', detail: 'A single bug in your script can corrupt your entire dataset instantly.' },
      ],
      investment: [
        { lead: 'VS Code', detail: 'Free (Open Source).' },
        {
          lead: 'GitHub Copilot',
          detail: 'Low-to-medium monthly subscription (Individual or Business). Highly cost-effective for the speed it provides.',
        },
      ],
    },
    bestFor: 'Stages 1–3 · Cleaning, alignment & structuring',
    intro:
      'VS Code is your "workbench" — the place where you write the scripts that clean, transform, and structure your data. GitHub Copilot is your AI assistant sitting next to you, suggesting code, fixing errors, and writing complex data-processing functions in seconds. Together they turn hours of manual coding into a fast, guided process.',
    setup: {
      title: 'How to set it up',
      steps: [
        {
          title: 'Install VS Code',
          body: 'Download and install it from the official Visual Studio Code website. It is available for Windows, macOS, and Linux.',
        },
        {
          title: 'Install GitHub Copilot',
          body: 'Open VS Code, click the Extensions icon in the sidebar (it looks like four squares), search for "GitHub Copilot," and click Install. A prompt will ask you to sign in to GitHub — follow it to activate your subscription or trial.',
        },
      ],
    },
    usage: {
      title: 'How to use it',
      steps: [
        {
          title: 'Code completion',
          body: 'As you start typing a Python function (e.g. def clean_text(text):), Copilot shows "ghost text" suggestions for the rest. Hit Tab to accept.',
        },
        {
          title: 'Comment-to-code',
          body: 'The most powerful feature for data cleaning. Write a comment in plain English — like "# remove all HTML tags and emojis from a string" — press Enter, and Copilot writes the Python code for you.',
        },
        {
          title: 'Copilot Chat',
          body: 'Open a chat window inside VS Code and ask things like "How do I convert this CSV into JSON using Pandas?" or "Why am I getting a KeyError?"',
        },
        {
          title: 'Refactoring & debugging',
          body: 'Highlight a messy block of code and ask Copilot to "make this more efficient" or "fix the bug in this loop."',
        },
      ],
    },
    pricing: {
      trialNote: 'GitHub Copilot offers a 30-day free trial for individuals.',
      cards: [
        { label: 'VS Code (the editor)', value: '$0', note: 'Free forever, open source.' },
        { label: 'GitHub Copilot (the AI)', value: '~$10/mo', note: 'After a 30-day free trial.' },
      ],
    },
    canDo: [
      'Use the full AI suite — code completions, Copilot Chat, and terminal integration.',
      'Write advanced scripts for Pandas, NumPy, and JSON parsing even if you are not a Python expert.',
      'Work across languages — Python for data, SQL for databases, Bash for files, JS for scraping.',
      'Ask Copilot to explain any code you do not understand — a huge learning boost.',
    ],
    cantDo: [
      'Copilot cannot run the code for you — it only writes it. You still run it in the terminal.',
      'Hallucination risk: it can suggest code that looks correct but is wrong or uses outdated libraries. Always test.',
      'It cannot browse your hard drive for datasets — only files you have open in the editor.',
      'It does not know your intent — tell it explicitly what "clean" means for your data.',
    ],
    summaryHeaders: ['Feature', 'VS Code', 'GitHub Copilot'],
    summary: [
      { feature: 'Cost', cols: ['$0 — Free forever', '~$10/mo'] },
      { feature: 'Primary function', cols: ['Writing & running code', 'Suggesting & explaining code'] },
      { feature: 'Learning curve', cols: ['Low–Medium', 'Low (with basic coding)'] },
      { feature: 'Trial', cols: ['N/A', '30-day free trial'] },
      { feature: 'Key capability', cols: ['File management & debugging', 'Rapid code from comments'] },
    ],
    bottomLine:
      'VS Code is the essential tool for anyone moving beyond manual spreadsheet editing. Adding Copilot turns you from a "coder" into an "architect" — you provide the logic in plain English, and the AI handles the syntax. This is the fastest way to build professional data-cleaning pipelines.',
  },
  {
    slug: 'label-studio',
    name: 'Label Studio',
    emoji: '🎨',
    image: '/Label_Studio.png',
    role: 'The Versatile Multi-Modal Annotator',
    tagline: 'A jack-of-all-trades for labelling text, images, audio, and video.',
    accent: '#a855f7',
    toolkit: {
      subtitle: 'The Multimodal Orchestrator',
      intro:
        'Label Studio is the "Generalist." It is designed for high-complexity projects where the data isn\'t just text, but a combination of various formats.',
      stages: [
        {
          lead: 'Stage 4 (Intelligent Ground-Truthing)',
          detail: 'Specifically for Multimodal projects (e.g., labeling an image, video, or audio with descriptive text simultaneously).',
        },
      ],
      whenToUse:
        'Use this when your "Ground Truth" requires a custom interface. If you need a human to look at a video and tag the timestamp, or look at a medical scan and a patient report, Label Studio allows you to build a custom UI for that specific task. It is your tool for ensuring the final output is exported in a perfectly structured JSON format that also matches Stage 3 (Structuring the Dataset).',
      pros: [
        { lead: 'Versatility', detail: 'One tool for text, audio, image, and video, and more.' },
        { lead: 'Schema Control', detail: 'Excellent at ensuring the final export follows your strict structural requirements.' },
      ],
      cons: [
        { lead: 'Configuration Overhead', detail: 'Setting up complex, custom labeling interfaces can be time-consuming.' },
        { lead: 'Performance', detail: 'Can become sluggish if not hosted on powerful hardware.' },
      ],
      investment: [
        { lead: 'Community Edition', detail: 'Free (Open Source).' },
        {
          lead: 'Enterprise Edition',
          detail: 'High (Significant budget required for large teams, security, and advanced management features).',
        },
      ],
    },
    bestFor: 'Stage 4 · Multimodal labelling',
    intro:
      'Label Studio is a highly flexible, multi-modal data-labelling tool. While tools like Prodigy focus almost exclusively on text, Label Studio is a jack-of-all-trades. It lets you label virtually any type of data — text, images, audio, video, time-series, and even multi-modal combinations (e.g. an image with a text description). It is the most popular choice for teams that need a single platform for diverse AI training data.',
    setup: {
      title: 'How to set it up',
      steps: [
        {
          title: 'Option A — Local install (the free / developer way)',
          body: 'Install via Python with pip install label-studio, or (recommended) run a single Docker command to pull the image and start the server. Best for individuals, students, and small projects who want everything on their own machine for free.',
        },
        {
          title: 'Option B — Label Studio Cloud / Enterprise (the managed way)',
          body: 'Sign up for a managed account on their website. No installation required — you simply log in and start uploading data. Best for companies and large teams that need security, user management, and zero server maintenance.',
        },
      ],
    },
    usage: {
      title: 'How to use it',
      steps: [
        { title: 'Create a project', body: 'Start by naming your project (e.g. "Fruit Classifier" or "Sentiment Analysis").' },
        { title: 'Import data', body: 'Upload your files — CSV, JSON, images, audio clips, and more.' },
        {
          title: 'Configure the labelling interface',
          body: 'This is where Label Studio shines. Use a visual editor or simple XML config to decide how you will label — e.g. a checkbox for Positive/Negative, or a bounding-box tool for images.',
        },
        { title: 'Label', body: 'You or your team go through the data and apply the labels.' },
        { title: 'Export', body: 'Once finished, export in the exact format your AI model needs — JSON, CSV, COCO, and more.' },
      ],
    },
    pricing: {
      cards: [
        { label: 'Open Source / Community', value: '$0', note: 'Self-hosted, full core labelling tools, unlimited data.' },
        { label: 'Enterprise', value: 'Custom', note: 'Managed hosting, roles, SSO, ML-assisted labelling, dedicated support.' },
      ],
    },
    canDo: [
      'Label everything — text, image, audio, and video with the core tools.',
      'Build highly specific labelling templates to match your exact taxonomy.',
      'No limits on files uploaded or labels created.',
      'Export in many common machine-learning formats.',
      'Full control — since you host it, you control how data is stored.',
    ],
    cantDo: [
      'No real team management in the free version — no easy roles like "Manager" vs "Labeler".',
      'No enterprise security (SSO, advanced encryption, audit logs) without paying.',
      'No managed hosting — if the server goes down, you fix it.',
      'ML-assisted labelling is possible but far easier to manage in the Enterprise version.',
    ],
    summaryHeaders: ['Feature', 'Open Source (Free)', 'Enterprise (Paid)'],
    summary: [
      { feature: 'Data types', cols: ['Text, image, audio, video', 'Text, image, audio, video'] },
      { feature: 'User management', cols: ['Minimal / none', 'Advanced roles & permissions'] },
      { feature: 'Hosting', cols: ['Self-hosted by you', 'Managed by Label Studio'] },
      { feature: 'Security', cols: ['Basic', 'Enterprise-grade (SSO, etc.)'] },
      { feature: 'Support', cols: ['Community forum', 'Dedicated support team'] },
      { feature: 'Cost', cols: ['$0', 'Custom / subscription'] },
    ],
    bottomLine:
      'For an individual or a small team working on a specific project, the open-source version is one of the most powerful free tools in the AI industry. But if you are a company hiring 50 people to label data, the Enterprise version is a necessity to manage the people, the security, and the workflow.',
  },
  {
    slug: 'prodigy',
    name: 'Prodigy',
    emoji: '⚡',
    image: '/Prodigy.png',
    role: "The Professional's Choice for NLP",
    tagline: 'A precision instrument built for high-velocity text labelling.',
    accent: '#34d399',
    toolkit: {
      subtitle: 'The NLP Speed Demon',
      intro:
        'Prodigy is the "Specialist." It is built by the creators of spaCy (the leading NLP library) and is optimized for one thing: high-velocity text labeling.',
      stages: [
        {
          lead: 'Stage 4 (Intelligent Dataset Labeling)',
          detail: 'Specifically for Linguistic/NLP or text-only projects.',
        },
      ],
      whenToUse:
        'Use this when your goal is purely text-based (Sentiment, Named Entity Recognition, Text Classification). You don\'t just "label" in Prodigy; you "train while you label." You use its Active Learning feature: the tool shows you the data it is most "confused" about. You provide the answer, the model learns, and it immediately becomes smarter, showing you even better samples.',
      pros: [
        { lead: 'Blazing Speed', detail: 'Active learning reduces the amount of data a human needs to see by up to 80%.' },
        { lead: 'NLP Integration', detail: 'Seamlessly integrates with advanced linguistic models.' },
      ],
      cons: [
        { lead: 'Narrow Scope', detail: 'Not suitable for image, video, or audio labeling.' },
        { lead: 'No Free Tier', detail: 'It is a strictly professional, paid product.' },
      ],
      investment: [
        {
          lead: 'Commercial License',
          detail: 'Medium-to-High (Usually a one-time or subscription-based license per user/project). It is an investment in time-saving.',
        },
      ],
    },
    bestFor: 'Stage 4 · Text / NLP labelling',
    intro:
      'Prodigy is a high-end, developer-centric data-annotation tool designed specifically for Natural Language Processing (NLP). It was built by the creators of spaCy, one of the most widely used NLP libraries in the world. It solves the biggest problem in AI training: manual labelling is slow, expensive, and prone to human error.',
    setup: {
      title: 'How to set it up',
      steps: [
        { title: 'Python environment', body: 'Prodigy is professional software, not click-and-run. You must have Python installed.' },
        { title: 'Install', body: 'Install it from your terminal with pip install prodigy using your licence key.' },
        { title: 'Launch the server', body: 'Run a command in your terminal to start a local web server.' },
        { title: 'Open the browser', body: 'Once the server is running, open your browser to a local address (e.g. localhost:8080) to see the labelling interface.' },
      ],
    },
    usage: {
      title: 'How to use it — the Active-Learning loop',
      steps: [
        { title: '1. Initial seed', body: 'You label a very small amount of data (e.g. 50 sentences) manually.' },
        { title: '2. Model training', body: 'Prodigy uses those 50 sentences to train a "mini-model" on the fly.' },
        { title: '3. AI-assisted labelling', body: 'The mini-model looks at the next 1,000 sentences and guesses the labels.' },
        { title: '4. Human correction', body: 'You no longer "label" — you simply confirm correct guesses or correct wrong ones. This makes the process exponentially faster.' },
      ],
    },
    pricing: {
      trialNote: 'Prodigy typically offers a 30-day evaluation period to test before committing to a licence.',
      cards: [
        { label: 'Commercial licence', value: 'Paid', note: 'Per-user / per-project. An investment in time-saving.' },
        { label: 'Evaluation', value: '30 days', note: 'Full NLP suite during the trial period.' },
      ],
    },
    canDo: [
      'Full NLP suite — NER, text classification, relationship extraction, and more.',
      'Active learning — the suggest-and-correct workflow that makes it so fast.',
      'Feed data directly from Python scripts and export spaCy / Transformers-ready datasets.',
      'Create custom "recipes" tailored to your industry (legal, medical, financial).',
    ],
    cantDo: [
      'No permanent free tier — once the trial ends, you must buy a licence.',
      'Not for non-coders — if you cannot use a terminal or manage Python, it is hard to use.',
      'The standard licence is per-user; large teams need enterprise licensing.',
      'Not multi-modal — it is optimised for text. For video or 3D medical images, use Label Studio.',
    ],
    summaryHeaders: ['Feature', 'Prodigy Professional'],
    summary: [
      { feature: 'Primary use case', cols: ['High-speed NLP / text labelling'] },
      { feature: 'Skill level', cols: ['Intermediate–Advanced (developer)'] },
      { feature: 'Pricing model', cols: ['Paid licence (per user / project)'] },
      { feature: 'Free option', cols: ['30-day evaluation / trial only'] },
      { feature: 'Key workflow', cols: ['Active learning (AI-assisted)'] },
      { feature: 'Data export', cols: ['Highly structured (JSON / Python-ready)'] },
    ],
    bottomLine:
      'Prodigy is not a toy or a hobbyist tool. It is a precision instrument for professional AI developers. If you are building a serious NLP model and need to label thousands of text entries with maximum accuracy and minimum time, a Prodigy licence is often much cheaper than hiring humans to label manually.',
  },
];

export function getToolBySlug(slug?: string): ToolDeepDive | undefined {
  if (!slug) return undefined;
  return TOOL_DEEP_DIVES.find((t) => t.slug === slug);
}
