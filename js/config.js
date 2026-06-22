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
  system: `You are a senior freelance software developer writing a client proposal. 
Output ONLY valid JSON — no markdown, no code fences.
Tone: confident, honest, direct. No agency fluff. No email address ever.
The developer works solo (with brother as backup), full-stack, Upwork freelancer.
Never mention pricing or hourly rates unless the job post explicitly asks.`,
  user: `Analyze this job post and generate a tailored software development proposal as JSON.

JOB POST:
{{JOB_POST}}

Return this exact JSON structure:
{
  "projectTitle": "short compelling title for cover (max 8 words)",
  "coverHeadline": "headline with one <span>highlighted</span> phrase in HTML",
  "coverSubtitle": "1-2 sentences why you're right for THIS job",
  "tags": ["6-8 relevant tech/skill tags from the job"],
  "understandingLead": "paragraph showing you understand their problem",
  "requirements": [
    { "requirement": "specific requirement from job", "response": "how you will address it" }
  ],
  "strategyOverview": "2-3 sentence technical approach for THIS project",
  "phases": [
    { "title": "phase name", "description": "what happens and deliverable" }
  ],
  "techStack": ["technologies you will use for this project"],
  "deliverables": ["concrete deliverables"],
  "whyMePoints": ["3-4 reasons you're a fit — reference relevant experience"],
  "timeline": [
    { "phase": "name", "duration": "e.g. Week 1-2", "output": "deliverable" }
  ],
  "closingNote": "1 sentence personalized close",
  "demoPlan": {
    "title": "short demo name e.g. Working API scaffold",
    "description": "what mini demo you would build in week 1 to prove approach",
    "items": ["2-4 concrete demo deliverables"]
  }
}

Extract at least 4 requirements from the job post. Be specific to the job — not generic.
For software jobs, always include demoPlan with a realistic quick proof-of-approach.`
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

function loadSettings() {
  const profile = { ...DEFAULT_PROFILE, ...safeParse(localStorage.getItem(STORAGE_KEYS.profile)) };
  const prompts = { ...DEFAULT_PROMPTS, ...safeParse(localStorage.getItem(STORAGE_KEYS.prompts)) };
  return {
    profile,
    prompts,
    apiKey: localStorage.getItem(STORAGE_KEYS.apiKey) || '',
    mode: localStorage.getItem(STORAGE_KEYS.mode) || 'template',
    model: localStorage.getItem(STORAGE_KEYS.model) || 'gpt-4o-mini'
  };
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(settings.profile));
  localStorage.setItem(STORAGE_KEYS.prompts, JSON.stringify(settings.prompts));
  localStorage.setItem(STORAGE_KEYS.apiKey, settings.apiKey);
  localStorage.setItem(STORAGE_KEYS.mode, settings.mode);
  localStorage.setItem(STORAGE_KEYS.model, settings.model);
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
