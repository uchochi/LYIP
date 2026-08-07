import type { ComponentType } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CodeSnippet {
  title: string;
  lang: 'json' | 'text' | 'bash';
  code: string;
}

export interface StepItem {
  title: string;
  body: string;
}

export type StageResult =
  | { kind: 'diff'; before: string; after: string }
  | { kind: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { kind: 'code'; snippet: CodeSnippet };

export interface PipelineStage {
  id: string;
  n: number;
  title: string;
  tagline: string;
  objective: string;
  accent: string; // accent color used for hue shift + highlights
  intro: string;
  steps: StepItem[];
  result?: StageResult;
}

export interface PricingCard {
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
}

export interface ToolDeepDive {
  slug: string;
  name: string;
  emoji: string;
  role: string; // e.g. "The Engineering Command Center"
  tagline: string;
  accent: string;
  gatewayBlurb: string;
  primaryStages: string;
  intro: string;
  setup: { title?: string; steps: StepItem[] };
  usage: { title?: string; steps: StepItem[] };
  pricing: { title?: string; trial?: string; cards: PricingCard[] };
  pros: string[];
  cons: string[];
  summaryHeaders: string[];
  summary: { feature: string; cols: string[] }[];
  bottomLine: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
}

// ---------------------------------------------------------------------------
// The four-stage synthesis pipeline (from AA.md)
// ---------------------------------------------------------------------------

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 'signal-extraction',
    n: 1,
    title: 'Signal Extraction',
    tagline: 'Automated Refinement',
    objective: 'Strip away "noise" and isolate the pure semantic signals required for training.',
    accent: '#3b82f6',
    intro:
      'Through automated refinement, we transform unorganized text into standardized, high-signal inputs. This stage focuses on the instant removal of non-semantic data — such as HTML artifacts, irregular syntax, and irrelevant metadata — so the model processes only high-value information.',
    steps: [
      { title: 'Standardization at Scale', body: 'Automatic normalization of casing, punctuation, and spelling across millions of rows.' },
      { title: 'Noise Suppression', body: 'Instant removal of URLs, excessive emojis, and "fluff" tokens that add no meaning.' },
    ],
    result: {
      kind: 'diff',
      before: '"OMG!!! i loooove this product... it\'s sooooo good!!! 😍😍😍 check it out at http://store.com/item123"',
      after: '"I love this product. It is very good."',
    },
  },
  {
    id: 'algorithmic-alignment',
    n: 2,
    title: 'Algorithmic Alignment',
    tagline: 'Linguistic Scaling',
    objective: 'Create perfectly mapped Parallel Corpora through high-speed linguistic scaling.',
    accent: '#a855f7',
    intro:
      'High-performance multilingual models require 1:1 mathematical alignment between languages. Algorithmic alignment automates the creation of these datasets, ensuring that every source entry is paired with a perfectly translated, high-fidelity target entry.',
    steps: [
      { title: 'Precision Mapping', body: 'Ensuring exact 1:1 row-level correspondence across entire datasets.' },
      { title: 'Encoding Integrity', body: 'Enforcing UTF-8 standards across the pipeline to prevent character corruption and maintain linguistic accuracy.' },
    ],
    result: {
      kind: 'table',
      headers: ['English (Source)', 'Spanish (Target)'],
      rows: [
        ['Hello, how are you?', 'Hola, ¿cómo estás?'],
        ['Good morning!', '¡Buenos días!'],
      ],
      caption: 'Perfect alignment and clean character encoding across millions of rows.',
    },
  },
  {
    id: 'structural-engineering',
    n: 3,
    title: 'Structural Engineering',
    tagline: 'Programmatic Schema Enforcement',
    objective: 'Enforce machine-readable schemas through programmatic automation.',
    accent: '#22d3ee',
    intro:
      'A dataset is only as useful as its structure. Structural Engineering replaces manual organization with Schema Enforcement — using code to transform raw inputs into highly predictable formats like JSON, CSV, or Parquet, so every entry adheres to a strict, mathematical hierarchy.',
    steps: [
      { title: 'Schema Consistency', body: 'Automating the verification of data types — ensuring integers, strings, and booleans never collide.' },
      { title: 'Complex Nesting', body: 'Programmatically converting flat text into sophisticated, nested JSON structures for complex NLP tasks.' },
    ],
    result: {
      kind: 'code',
      snippet: {
        title: 'messages.json',
        lang: 'json',
        code: `[
  { "user_id": 1, "message": "Hello!",          "timestamp": "2023-10-01T10:00:00Z" },
  { "user_id": 2, "message": "Hi, how are you?", "timestamp": "2023-10-01T10:05:00Z" }
]`,
      },
    },
  },
  {
    id: 'ground-truthing',
    n: 4,
    title: 'Intelligent Ground-Truthing',
    tagline: 'AI-Assisted Annotation',
    objective: 'Establish the "Ground Truth" via AI-assisted, high-velocity annotation.',
    accent: '#34d399',
    intro:
      'The final stage establishes Ground Truth — the definitive labels that teach the AI. Rather than traditional labeling, we use Active Learning and Strict Taxonomy Enforcement so every tag is accurate, consistent, and mathematically mapped to the input.',
    steps: [
      { title: 'Taxonomy Control', body: 'Eliminating label drift by forcing all annotations into a pre-defined, high-precision set of categories.' },
      { title: 'Active Learning Loops', body: 'Using AI to identify "low-confidence" data points, focusing human intelligence only on the most complex samples to maximize efficiency.' },
    ],
    result: {
      kind: 'table',
      headers: ['Review', 'Label'],
      rows: [
        ['"The delivery was fast!"', 'Positive'],
        ['"Terrible experience."', 'Negative'],
      ],
      caption: 'Taxonomy: [Positive, Neutral, Negative]',
    },
  },
];

// ---------------------------------------------------------------------------
// Tool deep dives (from AB.md)
// ---------------------------------------------------------------------------

export const TOOL_DEEP_DIVES: ToolDeepDive[] = [
  {
    slug: 'vscode-copilot',
    name: 'VS Code & GitHub Copilot',
    emoji: '💻',
    role: 'The Engineering Command Center',
    tagline: "The AI-Powered Developer's Toolkit",
    accent: '#3b82f6',
    gatewayBlurb:
      'The foundational tool. Where you build the machines that move and transform data at scale — not for labeling, but for engineering structure.',
    primaryStages: 'Stage 1 (Signal Extraction) · Stage 2 (Alignment) · Stage 3 (Structural Engineering)',
    intro:
      'VS Code is your "workbench" — the place where you write the scripts that clean, transform, and structure your data. GitHub Copilot is your AI assistant, suggesting code, fixing errors, and writing complex data-processing functions in seconds. Together they turn hours of manual coding into a fast, guided process.',
    setup: {
      title: 'How to set it up',
      steps: [
        { title: 'Install VS Code', body: 'Download it from the official Visual Studio Code website. It is free and available for Windows, macOS, and Linux.' },
        { title: 'Open the Extensions panel', body: 'Click the Extensions icon in the left sidebar (it looks like four squares) and search for "GitHub Copilot".' },
        { title: 'Install & sign in', body: 'Click Install, then follow the prompts to link your GitHub account and activate your subscription or 30-day trial.' },
      ],
    },
    usage: {
      title: 'How to use it',
      steps: [
        { title: 'Code Completion', body: 'As you start typing a Python function (e.g. def clean_text(text):), Copilot shows greyed-out "ghost text". Hit Tab to accept.' },
        { title: 'Comment-to-Code', body: 'Write a plain-English comment like "# remove all HTML tags and emojis" and press Enter — Copilot writes the Python for you.' },
        { title: 'Copilot Chat', body: 'Ask inside VS Code: "How do I convert this CSV to JSON with Pandas?" or "Why am I getting a KeyError?"' },
        { title: 'Refactor & Debug', body: 'Highlight messy code and ask Copilot to "make this more efficient" or "fix the bug in this loop".' },
      ],
    },
    pricing: {
      title: 'Pricing & free trial',
      trial: 'GitHub Copilot offers a 30-day free trial for individuals.',
      cards: [
        { label: 'VS Code', value: '$0', note: 'Free forever, open source', highlight: true },
        { label: 'Copilot', value: '~$10/mo', note: 'After the 30-day trial' },
      ],
    },
    pros: [
      'Infinite scalability — code processes terabytes that no UI could load.',
      'Precision — write exact logic for every edge case.',
      'Comment-to-code massively speeds up data-cleaning scripts.',
    ],
    cons: [
      'Requires some Python (or similar) proficiency.',
      'A single bug can corrupt an entire dataset instantly.',
      'Copilot can hallucinate — you must always test what it writes.',
    ],
    summaryHeaders: ['Feature', 'VS Code', 'GitHub Copilot'],
    summary: [
      { feature: 'Cost', cols: ['$0 (Free Forever)', 'Subscription (~$10/mo)'] },
      { feature: 'Primary function', cols: ['Writing & running code', 'Suggesting & explaining code'] },
      { feature: 'Learning curve', cols: ['Low to Medium', 'Low (with basic coding)'] },
      { feature: 'Trial period', cols: ['N/A', '30-Day Free Trial'] },
      { feature: 'Key capability', cols: ['File management & debugging', 'Rapid code generation via comments'] },
    ],
    bottomLine:
      'VS Code is essential for anyone moving beyond manual spreadsheet editing. Add Copilot and you become an architect — you provide the logic in plain English, and the AI handles the heavy lifting of writing the syntax.',
  },
  {
    slug: 'label-studio',
    name: 'Label Studio',
    emoji: '🎯',
    role: 'The Multimodal Orchestrator',
    tagline: 'The Versatile Multi-Modal Annotator',
    accent: '#a855f7',
    gatewayBlurb:
      'The "Generalist." Built for high-complexity projects where data is a combination of text, image, audio, and video — and you need a custom labeling interface.',
    primaryStages: 'Stage 4 (Intelligent Ground-Truthing) — for Multimodal projects',
    intro:
      'Label Studio is a highly flexible, multi-modal data labeling tool. While tools like Prodigy focus on text, Label Studio is a jack-of-all-trades — letting you label virtually any type of data: text, images, audio, video, time-series, and multi-modal combinations (e.g. an image with a text description).',
    setup: {
      title: 'How to set it up — two paths',
      steps: [
        { title: 'Option A — Local (Free / Developer)', body: 'Install via Python (pip install label-studio) or, recommended, run a single Docker command to pull the image and start the server. Best for individuals and small projects.' },
        { title: 'Option B — Cloud / Enterprise (Managed)', body: 'Sign up for a managed account on their website. No installation — just log in and upload data. Best for companies needing security and user management.' },
      ],
    },
    usage: {
      title: 'How to use it',
      steps: [
        { title: 'Create a Project', body: 'Name it (e.g. "Fruit Classifier" or "Sentiment Analysis").' },
        { title: 'Import Data', body: 'Upload your files — CSV, JSON, images, audio clips, and more.' },
        { title: 'Configure the Labeling Interface', body: 'Use the visual editor or simple XML config to decide how to label — checkboxes, bounding boxes, etc.' },
        { title: 'Label & Export', body: 'Apply your labels, then export in the exact format your model needs (JSON, CSV, COCO…).' },
      ],
    },
    pricing: {
      title: 'Free vs. Enterprise',
      cards: [
        { label: 'Open Source', value: '$0', note: 'Self-hosted, unlimited data', highlight: true },
        { label: 'Enterprise', value: 'Custom', note: 'Managed, security, team management' },
      ],
    },
    pros: [
      'Versatility — one tool for text, audio, image, and video.',
      'Schema control — excellent at matching your strict export structure.',
      'Custom interfaces for any task you can describe in XML.',
    ],
    cons: [
      'Configuration overhead — complex custom UIs take time to build.',
      'Can become sluggish on extremely large datasets without strong hardware.',
      'Free version lacks team management and advanced security.',
    ],
    summaryHeaders: ['Feature', 'Open Source (Free)', 'Enterprise (Paid)'],
    summary: [
      { feature: 'Data types', cols: ['Text, Image, Audio, Video…', 'Text, Image, Audio, Video…'] },
      { feature: 'User management', cols: ['Minimal / None', 'Advanced (roles & permissions)'] },
      { feature: 'Hosting', cols: ['Self-hosted by you', 'Managed by Label Studio'] },
      { feature: 'Security', cols: ['Basic', 'Enterprise-grade (SSO, etc.)'] },
      { feature: 'Support', cols: ['Community forum', 'Dedicated support team'] },
      { feature: 'Cost', cols: ['$0', 'Custom / Subscription'] },
    ],
    bottomLine:
      'For an individual or small team, the Open Source version is one of the most powerful free tools in AI. For a fleet of 50 labelers, Enterprise becomes a necessity to manage people, security, and workflow.',
  },
  {
    slug: 'prodigy',
    name: 'Prodigy',
    emoji: '⚡',
    role: 'The NLP Speed Demon',
    tagline: "The Professional's Choice for NLP Annotation",
    accent: '#f59e0b',
    gatewayBlurb:
      'The "Specialist." Built by the creators of spaCy and optimized for one thing: high-velocity text labeling using Active Learning.',
    primaryStages: 'Stage 4 (Intelligent Ground-Truthing) — for Linguistic / NLP projects',
    intro:
      'Prodigy is a high-end, developer-centric annotation tool designed specifically for Natural Language Processing. Built by the creators of spaCy, it solves the biggest problem in AI training: manual labeling is slow, expensive, and error-prone.',
    setup: {
      title: 'How to set it up',
      steps: [
        { title: 'Python Environment', body: 'You must have Python installed on your computer.' },
        { title: 'Installation', body: 'Install via your terminal: pip install prodigy.' },
        { title: 'Server Launch', body: 'Run a terminal command to start a local web server.' },
        { title: 'Browser Access', body: 'Open your browser to a local address (e.g. localhost:8080) to see the labeling interface.' },
      ],
    },
    usage: {
      title: 'How to use it — Active Learning',
      steps: [
        { title: 'Initial Seed', body: 'Label a small amount of data (e.g. 50 sentences) manually.' },
        { title: 'Model Training', body: 'Prodigy uses those to train a "mini-model" on the fly.' },
        { title: 'AI-Assisted Labeling', body: 'The mini-model guesses labels for the next 1,000 sentences.' },
        { title: 'Human Correction', body: 'You confirm correct guesses or correct wrong ones — exponentially faster than labeling from scratch.' },
      ],
    },
    pricing: {
      title: 'Pricing & trial',
      trial: 'Prodigy typically offers a 30-day evaluation period for professional users.',
      cards: [
        { label: 'Free tier', value: 'None', note: 'Paid license only' },
        { label: 'Commercial', value: 'Medium–High', note: 'Per user / project', highlight: true },
      ],
    },
    pros: [
      'Blazing speed — active learning cuts human effort by up to 80%.',
      'Seamless NLP integration with advanced linguistic models.',
      'Train-while-you-label workflow keeps improving the model.',
    ],
    cons: [
      'Narrow scope — not for image, video, or audio labeling.',
      'No free tier — strictly a professional, paid product.',
      'Not for non-coders; requires command-line and Python comfort.',
    ],
    summaryHeaders: ['Feature', 'Prodigy Professional'],
    summary: [
      { feature: 'Primary use case', cols: ['High-speed NLP / Text labeling'] },
      { feature: 'Skill level required', cols: ['Intermediate to Advanced (Developer)'] },
      { feature: 'Pricing model', cols: ['Paid license (per user / project)'] },
      { feature: 'Free option', cols: ['30-day evaluation / trial only'] },
      { feature: 'Key workflow', cols: ['Active Learning (AI-Assisted)'] },
      { feature: 'Data export', cols: ['Highly structured (JSON / Python-ready)'] },
    ],
    bottomLine:
      'Prodigy is a precision instrument for professional AI developers. If you are building a serious NLP model and need to label thousands of text entries with maximum accuracy and minimum time, the license is often cheaper than hiring humans to label manually.',
  },
];

export function getToolBySlug(slug?: string): ToolDeepDive | undefined {
  if (!slug) return undefined;
  return TOOL_DEEP_DIVES.find((t) => t.slug === slug);
}
