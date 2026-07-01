function generateFromTemplate(parsed, profile) {
  const { title, requirements, techStack, projectType, goals, timeline } = parsed;

  const stack = techStack.length ? techStack : inferStackFromType(projectType);
  const reqs = filterRequirements(requirements, title, projectType).slice(0, 6);
  const solutionItems = buildSolutionItems(reqs, stack, projectType);
  const phases = buildPhases(projectType, stack, parsed);
  const timelineRows = parsed.includeTimeline ? buildTimeline(phases, timeline) : [];

  return {
    projectTitle: title,
    coverHeadline: buildHeadline(title),
    tags: stack.slice(0, 6),
    task: solutionItems.map((i) => i.task),
    solutionOverview: buildSolutionOverview(title, projectType, stack, goals),
    solutionItems,
    deliverables: buildDeliverables(projectType, stack),
    timeline: timelineRows,
    includeTimeline: parsed.includeTimeline,
    profile
  };
}

function filterRequirements(requirements, title, projectType) {
  const titleKey = title.toLowerCase().slice(0, 25);
  const defaults = defaultRequirements(projectType);
  const filtered = (requirements.length ? requirements : defaults).filter((req) => {
    const lower = req.toLowerCase();
    if (req.length > 140) return false;
    if (/^looking for|^seeking|^hiring|^we are looking/i.test(req)) return false;
    if (lower === title.toLowerCase()) return false;
    if (titleKey.length > 12 && lower.startsWith(titleKey)) return false;
    return true;
  });
  return filtered.length ? dedupe(filtered) : defaults;
}

function buildSolutionItems(reqs, stack, projectType) {
  const used = new Set();
  return reqs.map((req, i) => {
    let response = templateResponse(req, stack, projectType, i);
    if (used.has(response)) {
      response = `I'll scope this in ${stack[0] || 'the agreed stack'} with clear milestones, tests on your staging environment, and your sign-off before we move forward.`;
    }
    used.add(response);
    return { task: truncate(req, 140), response };
  });
}

function buildHeadline(title) {
  const short = title.length > 48 ? title.slice(0, 46) + '…' : title;
  return `Proposal for <span>${escapeHtml(short)}</span>`;
}

function buildSolutionOverview(title, projectType, stack, goals) {
  const goal = goals[0] ? truncate(goals[0], 120) : truncate(title, 100);
  const stackNote = stack.slice(0, 4).join(', ');
  return `You need ${goal.toLowerCase()}. I'll deliver this as a production-ready ${projectType} using ${stackNote} — working directly with you, no agency layers. Below is how I address each point from your job post.`;
}

function inferStackFromType(type) {
  const map = {
    'mobile application': ['React Native', 'TypeScript', 'Firebase'],
    'backend system': ['Node.js', 'PostgreSQL', 'REST API'],
    'automation solution': ['Python', 'Node.js', 'Webhooks'],
    'AI-powered application': ['Python', 'OpenAI', 'React'],
    'e-commerce platform': ['React', 'Stripe', 'Node.js'],
    'SaaS product': ['React', 'Node.js', 'PostgreSQL'],
    'web portal': ['React', 'TypeScript', 'Node.js'],
    'website': ['React', 'WordPress', 'Tailwind CSS'],
    'content platform': ['WordPress', 'PHP', 'React']
  };
  return map[type] || ['React', 'Node.js', 'TypeScript'];
}

function defaultRequirements(type) {
  return [
    `Deliver a production-ready ${type} aligned to your scope`,
    'Clean architecture with documented setup and handover',
    'Incremental delivery with reviewable milestones',
    'Full source code ownership transferred to you'
  ];
}

function templateResponse(req, stack, projectType, index) {
  const lower = req.toLowerCase();
  const primary = stack[0] || 'the agreed stack';
  const secondary = stack[1] || 'supporting services';

  const rules = [
    [/stripe|payment|billing|checkout|subscription/, () =>
      `I'll implement ${/stripe/i.test(req) ? 'Stripe' : 'payment'} checkout with webhook verification, idempotent handlers, and test-mode validation before production — including failed payment and refund edge cases.`],
    [/webhook/, () =>
      `I'll build webhook handlers with signature verification, automatic retries, structured logging, and alerting so integrations stay reliable under real traffic.`],
    [/aws|deploy|host|docker|ci|devops|infrastructure/, () =>
      `I'll set up AWS staging and production with environment secrets, CI/CD pipeline, and a runbook so you control hosting — not locked to me after handover.`],
    [/api|integrat|third.party|connect/, () =>
      `I'll design REST endpoints with typed contracts, integration tests end-to-end with ${secondary}, and API documentation you can share with your team.`],
    [/auth|login|signup|register|oauth/, () =>
      `I'll implement secure authentication with session or JWT management, role-based access, password reset flows, and OWASP-aligned practices.`],
    [/ui|ux|design|responsive|frontend|react|vue|angular|mobile/, () =>
      `I'll build a polished, mobile-first interface in ${primary} — component-driven, accessible, and tested on real devices before launch.`],
    [/database|data|sql|mongo|postgres|schema|migration/, () =>
      `I'll model your data with normalized schemas, migration scripts, and indexing in ${/postgres/i.test(req) ? 'PostgreSQL' : secondary} — plus backup and recovery notes.`],
    [/django|flask|fastapi/, () =>
      `I'll build the backend in Python/Django with clean app structure, admin where useful, and documented endpoints your team can maintain.`],
    [/python/, () =>
      `I'll use Python for the core logic — readable modules, error handling, and tests on the paths that matter most for your workflow.`],
    [/automation|scraper|bot|llm|ai|openai|gpt/, () =>
      `I'll deliver automation with defined inputs/outputs, rate limits, cost controls, and error handling — production-ready, not a fragile script.`],
    [/test|qa|quality|bug/, () =>
      `I'll add unit tests on critical paths, integration tests for main flows, and a manual QA checklist signed off at each milestone.`],
    [/admin|dashboard|portal|crm|report/, () =>
      `I'll build an admin interface with filtering, export, and views your team will actually use day-to-day — not a static mockup.`],
    [/document|readme|handover|training/, () =>
      `I'll provide setup documentation, architecture notes, and a walkthrough session so your team can run and extend the system independently.`],
    [/migrat|legacy|refactor/, () =>
      `I'll plan a phased migration: audit what exists, map data flows, migrate in slices with rollback at each step.`]
  ];

  for (const [pattern, fn] of rules) {
    if (pattern.test(lower)) return fn();
  }

  const fallbacks = [
    `I'll implement this in ${primary} with clear acceptance criteria, staging demos for your review, and repo access from the first milestone.`,
    `I'll map this to your ${projectType} roadmap in ${primary} + ${secondary} — delivered, tested, and documented before we move to the next priority.`,
    `I'll handle this end-to-end in ${primary}: scoped, reviewed with you every few days, and signed off before the next phase.`
  ];
  return fallbacks[index % fallbacks.length];
}

function buildPhases(projectType, stack, parsed) {
  const tl = parsed.timeline;
  return [
    { title: 'Discovery & Scope', duration: 'Week 1', output: `Requirements locked, ${stack[0] || 'stack'} agreed` },
    { title: 'Core Build', duration: tl ? 'Week 2–4' : 'Week 2–5', output: `Main ${projectType} on staging` },
    { title: 'Launch & Handover', duration: tl ? 'Week 5+' : 'Week 6+', output: 'Production deploy + full transfer' }
  ];
}

function buildTimeline(phases, jobTimeline) {
  const weekMatch = jobTimeline?.match(/(\d+)/);
  if (!weekMatch) return phases;
  const total = Math.max(parseInt(weekMatch[1], 10), 4);
  const chunk = Math.max(1, Math.floor(total / phases.length));
  return phases.map((p, i) => ({
    ...p,
    duration: `Week ${i * chunk + 1}–${Math.min((i + 1) * chunk, total)}`
  }));
}

function buildDeliverables(projectType, stack) {
  return [
    `Production-ready ${projectType} in your repository`,
    `Full source (${stack.slice(0, 3).join(', ')}) with setup documentation`,
    'Staging and production environments configured',
    '30-day post-launch support for defects'
  ];
}

function dedupe(arr) {
  const seen = new Set();
  return arr.filter((item) => {
    const key = item.toLowerCase().slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1).trim() + '…' : s;
}
