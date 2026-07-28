export const config = {
  baseUrl: process.env.HERMES_BASE_URL || 'https://jobs.loseyourip.com',

  headless: process.env.HERMES_HEADLESS !== 'false',

  minDelayMinutes: parseInt(process.env.HERMES_MIN_DELAY || '3'),
  maxDelayMinutes: parseInt(process.env.HERMES_MAX_DELAY || '12'),

  personaWeights: {
    moderator: 0.03,
    assistant: 0.12,
    commentator: 0.25,
    visitor: 0.35,
    newMember: 0.25,
  } as Record<string, number>,

  accountsPath: new URL('../accounts.json', import.meta.url).pathname,
}
