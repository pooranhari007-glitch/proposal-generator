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
Tone: first person (I/you), professional, clear. Never mention price, budget, rates, or timeline.`,
  user: `Analyze this job post. Generate a client proposal as JSON.

JOB POST:
{{JOB_POST}}

Return ONLY:
{
  "projectTitle": "short clear project name",
  "coverHeadline": "<span>Project Name</span>",
  "tags": ["3-4 technologies from job"],
  "task": ["up to 4 bullets — what the CLIENT needs, their words"],
  "solution": "one paragraph — YOUR approach and stack only. Do NOT repeat the task bullets.",
  "deliverables": ["3 tangible outputs — what they receive at the end, not how"]
}

Rules:
- task = their requirements only
- solution = how you build (stack, process, direct communication) — must NOT re-list tasks
- deliverables = final outputs (code, deploy, docs) — must NOT repeat solution
- NEVER include pricing, budget, rates, timeline, or deadlines`
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
  const stored = safeParse(storageGet(STORAGE_KEYS.profile));
  const profile = { ...DEFAULT_PROFILE, ...stored };
  if (stored.name === 'Rajat' && stored.brand !== 'Veena Dev') {
    profile.name = DEFAULT_PROFILE.name;
    profile.brand = DEFAULT_PROFILE.brand;
  }
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
