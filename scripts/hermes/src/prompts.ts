const languages = ['Hausa', 'Yoruba', 'Igbo', 'Swahili', 'Zulu', 'Amharic', 'Wolof', 'Shona']
const pays = ['$50', '$60', '$75', '$80', '$90', '$100']
const payRanges = ['$50-$70', '$60-$80', '$75-$100', '$50-$100']

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export interface TopicTemplate {
  title: string
  content: string
  tags: string[]
}

export interface ReplyTemplate {
  content: string
}

export const moderatorTemplates: TopicTemplate[] = [
  {
    title: `New Dataset Opportunity: {{language}} — {{pay}}/dataset`,
    content: `We are launching a new {{language}} dataset curation project and are looking for contributors.

**Pay:** {{pay}} per dataset (1500+ words)
**Focus:** Authentic {{language}} text from news, literature, and social discourse.

**Requirements:**
- Native speaker proficiency
- Clean formatting with proper orthography
- Source attribution required
- No machine-translated content

Post your submissions here or ask questions below. Our review team will get back to you within 48 hours.`,
    tags: ['{{language}}', 'dataset-training', 'curation'],
  },
  {
    title: `Urgent: {{language}} Audio Transcription Project — {{payRange}}`,
    content: `We have an urgent need for {{language}} audio transcription specialists.

**Pay:** {{payRange}} per audio hour
**Format:** Timestamped transcription
**Audio length:** 15-45 minute clips

**Guidelines:**
1. Transcribe verbatim including fillers
2. Timestamp every 30 seconds
3. Note speaker changes
4. Include dialect information

Audio files are being prepared. Comment below if you are interested and we will assign clips.`,
    tags: ['{{language}}', 'audio-transcription', 'speech-recognition'],
  },
  {
    title: `Quality Review: {{language}} Submissions — What We Learned This Week`,
    content: `Weekly quality review for {{language}} dataset submissions.

**Good submissions had:**
- Clear source attribution
- Consistent orthography
- Proper word count labeling

**Common issues:**
- Missing diacritics / tone marks
- Code-switching without annotation
- Submissions under the minimum word count

Please review these points before your next submission. Keep up the great work!

Review team: {{modName}} and {{modName2}}`,
    tags: ['{{language}}', 'quality-review', 'dataset-training'],
  },
]

export const assistantTemplates: ReplyTemplate[] = [
  {
    content: `Thanks for your submission! I have reviewed it and have the following feedback:

**Strengths:**
- Good source selection
- Clean formatting

**Areas for improvement:**
- Please double-check the orthography in paragraphs 3-4
- A few sentences seem like they could be machine-translated — please verify
- Add the word count at the top

Please revise and resubmit. Happy to answer any questions!`,
  },
  {
    content: `Great question! Here is how to handle this:

**Step 1:** Identify the source type (news, literature, conversation)
**Step 2:** Format according to our template (source, date, text, word count)
**Step 3:** If using a non-standard dialect, mark it clearly

If you are unsure about a specific sentence, include it with a [NEEDS REVIEW] tag and we will look at it.

Hope this helps!`,
  },
  {
    content: `Adding to the discussion above — here are some important pointers for {{language}} submissions:

1. Pay attention to tonal marks — they change word meanings
2. Avoid mixing dialects in a single submission
3. Longer submissions (2000+ words) are preferred

We are seeing great progress from the community. Keep up the excellent work everyone!`,
  },
  {
    content: `I noticed a few submissions coming in without proper source attribution. Just a reminder:

Every entry needs:
- Publication name
- Date of publication
- URL or location reference
- Author name (if available)

This is important for our provenance tracking. Thanks for your cooperation!`,
  },
]

export const commentatorTemplates: ReplyTemplate[] = [
  {
    content: `This is very helpful! I have been working on {{language}} datasets for a few weeks and these tips will improve my next submission. One question — how do you handle proverbs and idioms? Should they be translated literally or with the equivalent meaning?`,
  },
  {
    content: `Interesting project! I recently completed a similar task for {{language}} and found that mixing formal and informal registers gives better coverage. Has anyone experimented with social media text for datasets?`,
  },
  {
    content: `Thanks for sharing these guidelines. I noticed the pay range varies by language — is that based on difficulty or demand? I would love to see more languages added to the program.`,
  },
  {
    content: `I have been a curator for about two months now and can confirm these tips are spot on. The review team is very responsive. My advice: always double-check your word count before submitting!`,
  },
  {
    content: `What is the policy on collaborative submissions? I work with a small team of fellow {{language}} speakers and we could produce larger volumes if group submissions are allowed.`,
  },
  {
    content: `Good to see this project expanding! I shared it with my linguistics department and several colleagues are interested. Is there a referral program or anything like that?`,
  },
  {
    content: `One suggestion: it would be great to have a style guide PDF we could download for offline reference. Sometimes connectivity is an issue and having the rules locally would help.`,
  },
  {
    content: `Just submitted my first dataset for this project! I will share my experience once I get feedback. So far the process has been straightforward and the guidelines are clear.`,
  },
]

export const visitorTemplates: ReplyTemplate[] = [
  { content: `Great initiative! Looking forward to contributing.` },
  { content: `This is exactly what I have been looking for. Going to prepare my first submission.` },
  { content: `Very clear guidelines. Thanks for putting this together.` },
  { content: `I know several people who would be interested in this. Sharing with my network.` },
  { content: `Nice to see {{language}} getting attention in AI datasets!` },
  { content: `Bookmarking this for later. Will submit something soon.` },
  { content: `The sample format is very helpful. Thanks!` },
  { content: `Happy to see this kind of work being done. Important for language preservation.` },
  { content: `This is valuable work. I will start working on a submission tonight.` },
  { content: `Thanks for the detailed explanation. Makes it easy to get started.` },
]

export const newMemberTemplates: TopicTemplate[] = [
  {
    title: `Hello from {{name}} — excited to join!`,
    content: `Hi everyone! I am {{name}} and I just joined the forum. I am a {{language}} speaker and I am excited to contribute to the dataset training project.

I have some experience with language documentation but I am new to AI dataset curation. Looking forward to learning from everyone here.

If anyone has tips for getting started, I would really appreciate them. Thanks!`,
    tags: ['introductions', '{{language}}', 'new-member'],
  },
  {
    title: `Question: How do I get started with {{language}} curation?`,
    content: `Hello everyone! I just signed up and I am interested in contributing to the {{language}} dataset project.

I read through the pinned topics but I still have a few questions:
1. Do I need any special software or tools?
2. What types of sources are preferred for a beginner?
3. How long does the review process usually take?

Any guidance would be greatly appreciated. Thanks in advance!`,
    tags: ['getting-started', '{{language}}', 'question'],
  },
  {
    title: `New {{language}} curator — sharing my background`,
    content: `Hi all! I am {{name}} and I wanted to introduce myself properly. I am a {{language}} speaker from {{city}} with a background in linguistics.

I found this project through a colleague and I am really impressed with the quality standards you maintain. I would like to help expand the {{language}} dataset.

I will start working on my first submission this week. Wish me luck!`,
    tags: ['introductions', '{{language}}', 'curator'],
  },
  {
    title: `Quick introduction — {{name}} from {{city}}`,
    content: `Hey forum! Quick intro — I am {{name}}, {{language}} speaker based in {{city}}. I work in education and I am interested in how AI can support language learning.

Looking forward to contributing to the datasets and learning from the community. Please let me know if there is anything I should read first before starting!`,
    tags: ['introductions', '{{language}}'],
  },
]

export function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`)
}

export function randomModeratorTopic(): TopicTemplate {
  const t = pick(moderatorTemplates)
  return {
    title: t.title,
    content: fill(t.content, {
      language: pick(languages),
      pay: pick(pays),
      payRange: pick(payRanges),
      modName: pick(['Aaron', 'Claire', 'Ethan']),
      modName2: pick(['Adam', 'Amber', 'Andrew', 'Erin']),
    }),
    tags: t.tags.map(tag => fill(tag, { language: pick(languages) })),
  }
}

export function randomAssistantReply(): string {
  return fill(pick(assistantTemplates).content, {
    language: pick(languages),
  })
}

export function randomCommentatorReply(): string {
  return fill(pick(commentatorTemplates).content, {
    language: pick(languages),
  })
}

export function randomVisitorReply(): string {
  return fill(pick(visitorTemplates).content, {
    language: pick(languages),
  })
}

export function randomNewMemberTopic(name: string): TopicTemplate {
  const t = pick(newMemberTemplates)
  return {
    title: fill(t.title, { name, language: pick(languages), city: pick(['Lagos', 'Nairobi', 'Accra', 'Addis Ababa', 'Dakar', 'Harare', 'Kampala', 'Dar es Salaam']) }),
    content: fill(t.content, { name, language: pick(languages), city: pick(['Lagos', 'Nairobi', 'Accra', 'Addis Ababa', 'Dakar', 'Harare', 'Kampala', 'Dar es Salaam']) }),
    tags: t.tags.map(tag => fill(tag, { language: pick(languages) })),
  }
}
