export const config = {
  baseUrl: process.env.HERMES_BASE_URL || 'https://jobs.loseyourip.com',

  headless: process.env.HERMES_HEADLESS !== 'false',

  // AI content generation (OpenRouter). Set OPENROUTER_API_KEY to enable;
  // falls back to the device's ~/.hermes/.env key if present.
  aiModel: process.env.OPENROUTER_MODEL || 'inclusionai/ling-3.0-flash:free',

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

  // Agent-driven mode (hermes-agent CLI drives Chromium over CDP).
  agentCli: process.env.HERMES_AGENT_CLI || '/usr/local/lib/hermes-agent/cli.py',
  agentPython: process.env.HERMES_AGENT_PYTHON || '/usr/local/lib/hermes-agent/venv/bin/python',
  agentModel: process.env.HERMES_AGENT_MODEL || 'qwen/qwen3.7-plus',
  agentMaxTurns: parseInt(process.env.HERMES_AGENT_MAX_TURNS || '25'),
  agentTimeoutMs: parseInt(process.env.HERMES_AGENT_TIMEOUT_MS || '600000'),
  agentDryRun: process.env.HERMES_AGENT_DRYRUN === '1',
}
