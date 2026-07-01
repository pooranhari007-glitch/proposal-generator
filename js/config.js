const DEFAULT_PROFILE = {
  name: 'Rajat',
  brand: 'Rajat Dev',
  title: 'Independent Developer & Consultant',
  upwork: 'upwork.com/freelancers/~01f65823609a7aac5f',
  github: 'github.com/Fullstackdeveloper4545',
  badge: 'Founder-Led Development',
  year: new Date().getFullYear().toString()
};

const DEFAULT_PROMPTS = {
  system: `You are a senior independent software developer drafting a client proposal.
Output ONLY valid JSON. No markdown, no code fences, no emojis.
Tone: first person (I/you), direct and personal — as if speaking one-to-one with the client on a call. Confident, clear, not corporate or agency-speak.
Never include email. Never mention pricing unless the job post explicitly asks.
Reference specific details from the job post — never write generic filler.
The developer works solo (brother as backup), full-stack, Upwork freelancer.`,
  user: `Analyze this job post deeply. Extract the client's real goals, pain points, and technical needs. Generate a tailored proposal as JSON.

JOB POST:
{{JOB_POST}}

Return this exact JSON structure:
{
  "projectTitle": "clear project name, max 8 words, derived from the job",
  "coverHeadline": "elegant headline with one <span>highlighted</span> phrase in HTML",
  "coverSubtitle": "2 sentences: what you understand they need + why you're the right fit",
  "tags": ["5-6 relevant technologies or domains from the job"],
  "understandingLead": "paragraph proving you read and understood their specific situation",
  "solution": {
    "title": "name of your proposed solution",
    "summary": "2-3 sentences: concrete technical approach solving their specific problem"
  },
  "requirements": [
    { "requirement": "exact requirement from job", "response": "specific how-you-will-solve-it, mention tech where relevant" }
  ],
  "strategyOverview": "2-3 sentences in first person (I/you): how you will personally build this for the client — conversational, direct, one-to-one",
  "phases": [
    { "title": "phase name", "description": "first-person description speaking directly to the client — what you will do and what they get" }
  ],
  "techStack": ["technologies chosen for this specific project and why"],
  "deliverables": ["5-6 concrete deliverables"],
  "timeline": [
    { "phase": "name", "duration": "e.g. Week 1-2", "output": "deliverable" }
  ],
  "closingNote": "1 professional sentence, personalized to the job"
}

Rules:
- Extract at least 5 requirements directly from the job post
- Every response must reference their actual needs, not generic templates
- solution.summary must describe a real technical approach
- strategyOverview and phase descriptions must use I/you and sound like a direct message to the client`
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
