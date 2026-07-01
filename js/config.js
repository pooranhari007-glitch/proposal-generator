const DEFAULT_PROFILE = {
  name: 'Veena',
  brand: 'Veena Dev',
  title: 'Independent Developer & Consultant',
  upwork: 'upwork.com/freelancers/~01f65823609a7aac5f',
  github: 'github.com/Fullstackdeveloper4545',
  badge: 'Founder-Led Development',
  year: new Date().getFullYear().toString()
};

const DEFAULT_PROMPTS = {
  system: `You are a senior independent software developer drafting a client proposal.
Output ONLY valid JSON. No markdown, no code fences, no emojis.
Tone: first person (I/you), direct and thorough — speak one-to-one with the client. Address every job post detail deeply.
Never include email address in body. Never mention pricing unless the job post asks.
Reference specific details from the job post — never generic filler.`,
  user: `Analyze this job post deeply. Generate a detailed proposal as JSON.

JOB POST:
{{JOB_POST}}

Return this exact JSON structure:
{
  "projectTitle": "clear project name",
  "coverHeadline": "Proposal for <span>highlighted title</span>",
  "tags": ["4-6 technologies from the job"],
  "task": ["each requirement from job — one line each, up to 6"],
  "solutionOverview": "2-3 sentences: what they need and your overall approach with stack",
  "solutionItems": [
    { "task": "requirement from job", "response": "2-3 sentences: exactly how you will solve this — mention tech" }
  ],
  "deliverables": ["4-5 concrete deliverables"],
  "timeline": [
    { "title": "phase", "duration": "Week 1-2", "output": "deliverable" }
  ]
}

Rules:
- Extract up to 6 tasks directly from the job post
- Each solutionItems.response must be 2-3 detailed sentences, unique per task
- solutionOverview sets context; per-task detail goes in solutionItems
- deliverables: what they receive at the end
- timeline only if job mentions a deadline`
};

const TECH_KEYWORDS = {
  react: 'React',
  'react native': 'React Native',
  vue: 'Vue',
  angular: 'Angular',
  node: 'Node.js',
  nodejs: 'Node.js',
  python: 'Python',
  django: 'Django',
  flask: 'Flask',
  fastapi: 'FastAPI',
  laravel: 'Laravel',
  php: 'PHP',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  mongodb: 'MongoDB',
  postgres: 'PostgreSQL',
  mysql: 'MySQL',
  aws: 'AWS',
  docker: 'Docker',
  kubernetes: 'Kubernetes',
  api: 'REST API',
  graphql: 'GraphQL',
  stripe: 'Stripe',
  shopify: 'Shopify',
  wordpress: 'WordPress',
  mern: 'MERN',
  mean: 'MEAN',
  nextjs: 'Next.js',
  'next.js': 'Next.js',
  ai: 'AI',
  openai: 'OpenAI',
  automation: 'Automation',
  mobile: 'Mobile Apps',
  ios: 'iOS',
  android: 'Android',
  flutter: 'Flutter',
  tailwind: 'Tailwind CSS',
  redis: 'Redis',
  firebase: 'Firebase',
  supabase: 'Supabase',
  prisma: 'Prisma',
  express: 'Express.js',
  nestjs: 'NestJS',
  java: 'Java',
  spring: 'Spring Boot',
  go: 'Go',
  rust: 'Rust',
  csharp: 'C#',
  '.net': '.NET',
  selenium: 'Selenium',
  puppeteer: 'Puppeteer',
  webhook: 'Webhooks',
  crm: 'CRM',
  saas: 'SaaS'
};

const STORAGE_KEYS = {
  profile: 'pg_profile',
  prompts: 'pg_prompts',
  apiKey: 'pg_api_key',
  mode: 'pg_mode',
  model: 'pg_model'
};

function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private browsing or blocked storage */
  }
}

function loadSettings() {
  const profile = { ...DEFAULT_PROFILE, ...safeParse(storageGet(STORAGE_KEYS.profile)) };
  const prompts = { ...DEFAULT_PROMPTS, ...safeParse(storageGet(STORAGE_KEYS.prompts)) };
  return {
    profile,
    prompts,
    apiKey: storageGet(STORAGE_KEYS.apiKey) || '',
    mode: storageGet(STORAGE_KEYS.mode) || 'template',
    model: storageGet(STORAGE_KEYS.model) || 'gpt-4o-mini'
  };
}

function saveSettings(settings) {
  storageSet(STORAGE_KEYS.profile, JSON.stringify(settings.profile));
  storageSet(STORAGE_KEYS.prompts, JSON.stringify(settings.prompts));
  storageSet(STORAGE_KEYS.apiKey, settings.apiKey);
  storageSet(STORAGE_KEYS.mode, settings.mode);
  storageSet(STORAGE_KEYS.model, settings.model);
}

function safeParse(str) {
  try { return str ? JSON.parse(str) : {}; } catch { return {}; }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
