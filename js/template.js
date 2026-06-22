function generateFromTemplate(parsed, profile) {
  const {
    title, requirements, techStack, projectType, skills,
    goals, painPoints, timeline, constraints
  } = parsed;

  const stack = techStack.length ? techStack : inferStackFromType(projectType);
  const tags = [...new Set([...stack.slice(0, 5), capitalize(projectType.split(' ')[0])])].slice(0, 6);

  const reqs = (requirements.length ? requirements : defaultRequirements(projectType)).slice(0, 6);

  const requirementItems = reqs.map((req, i) => ({
    requirement: req,
    response: templateResponse(req, stack, projectType, parsed, i)
  }));

  const phases = buildPhases(projectType, stack, parsed);
  const timelineRows = buildTimeline(phases, timeline);
  const solution = buildSolution(title, projectType, stack, goals, painPoints);
  const headline = buildHeadline(title);

  return {
    projectTitle: title,
    coverHeadline: headline,
    coverSubtitle: buildCoverSubtitle(projectType, stack, goals),
    tags,
    understandingLead: buildUnderstanding(projectType, goals, painPoints, title),
    solution,
    requirements: requirementItems,
    strategyOverview: buildStrategy(projectType, stack, goals),
    phases,
    techStack: stack,
    deliverables: buildDeliverables(projectType, stack, parsed),
    whyMePoints: buildWhyMe(stack, skills, projectType, parsed),
    timeline: timelineRows,
    closingNote: buildClosing(projectType, timeline),
    demoPlan: buildDemoPlan(projectType, stack, title, reqs),
    profile
  };
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
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
    `Production-ready ${type} aligned to the stated scope`,
    'Clean architecture with documented setup and handover',
    'Incremental delivery with reviewable milestones',
    'Full source code ownership transferred to you'
  ];
}

function buildHeadline(title) {
  const short = title.length > 42 ? title.slice(0, 40) + '…' : title;
  return `A focused plan for <span>${escapeHtml(short)}</span>`;
}

function buildCoverSubtitle(projectType, stack, goals) {
  const goalRef = goals[0] ? ` — aimed at ${truncate(goals[0], 80)}` : '';
  return `Purpose-built ${projectType} using ${stack.slice(0, 3).join(', ')}${goalRef}. Direct developer, milestone delivery, code you own.`;
}

function buildUnderstanding(projectType, goals, painPoints, title) {
  let lead = `You are looking for a dependable partner to deliver ${title.toLowerCase()}. `;
  if (goals[0]) lead += `The core objective is ${truncate(goals[0].toLowerCase(), 120)}. `;
  if (painPoints[0]) lead += `I understand the friction: ${truncate(painPoints[0].toLowerCase(), 100)}. `;
  lead += `Below is how I would address each requirement with a clear, buildable solution — not generic agency language.`;
  return lead;
}

function buildSolution(title, projectType, stack, goals, painPoints) {
  const goal = goals[0] ? truncate(goals[0], 100) : `a reliable ${projectType}`;
  const pain = painPoints[0] ? ` This directly addresses ${truncate(painPoints[0].toLowerCase(), 80)}.` : '';
  return {
    title: `Recommended approach for ${truncate(title, 50)}`,
    summary: `I will deliver ${goal} as a ${projectType} built on ${stack.slice(0, 3).join(', ')} — modular, testable, and deployed in stages so you validate each layer before moving forward.${pain}`
  };
}

function buildStrategy(projectType, stack, goals) {
  const goalHint = goals[0] ? ` Every technical decision maps back to: ${truncate(goals[0].toLowerCase(), 90)}.` : '';
  return `The architecture separates UI, business logic, and data — using ${stack.slice(0, 4).join(', ')} for a maintainable ${projectType}.${goalHint} I ship working increments, not slide decks.`;
}

function templateResponse(req, stack, projectType, parsed, index) {
  const lower = req.toLowerCase();
  const primary = stack[0] || 'the agreed stack';
  const secondary = stack[1] || 'supporting services';

  const rules = [
    [/stripe|payment|billing|checkout|subscription/, () =>
      `Implement ${/stripe/i.test(req) ? 'Stripe' : 'payment'} flows with webhook verification, idempotent handlers, and test-mode validation before production — including failed payment and refund edge cases.`],
    [/api|integrat|webhook|third.party|connect/, () =>
      `Design RESTful endpoints with typed contracts, retry logic, and structured logging. Integration tested end-to-end with ${secondary} before handover.`],
    [/auth|login|user|signup|register|oauth/, () =>
      `Secure authentication with session/JWT management, role-based access, and password reset flows — following OWASP basics, not shortcuts.`],
    [/ui|ux|design|responsive|frontend|react|vue|angular|mobile/, () =>
      `Build a refined, mobile-first interface in ${primary} — component-driven, accessible, and performance-tested on real devices.`],
    [/database|data|sql|mongo|postgres|schema|migration/, () =>
      `Model data with normalized schemas, migration scripts, and indexing strategy in ${/postgres/i.test(req) ? 'PostgreSQL' : secondary} — with backup and recovery documented.`],
    [/deploy|host|aws|docker|ci|devops|server|infrastructure/, () =>
      `Set up staging + production environments with CI pipeline, environment secrets, and a runbook so you are never locked to me for hosting.`],
    [/ai|ml|chatbot|openai|gpt|llm|automation|scraper|bot/, () =>
      `Deliver practical automation: defined inputs/outputs, error handling, rate limits, and cost controls — production-ready, not a demo that breaks under load.`],
    [/test|qa|quality|bug/, () =>
      `Unit tests on critical paths, integration tests for API flows, and a manual QA checklist signed off at each milestone.`],
    [/seo|performance|speed|optim/, () =>
      `Core Web Vitals optimization, semantic markup, and measurable performance benchmarks before launch.`],
    [/admin|dashboard|portal|crm|report/, () =>
      `Admin interface with clear data views, filtering, and export — built for daily use, not just a static mockup.`],
    [/migrat|legacy|refactor|rewrite/, () =>
      `Phased migration plan: audit current system, map data flows, migrate in slices with rollback strategy at each step.`],
    [/document|readme|handover|training/, () =>
      `Technical documentation, setup guide, and a walkthrough session so your team can maintain the system independently.`]
  ];

  for (const [pattern, fn] of rules) {
    if (pattern.test(lower)) return fn();
  }

  const contextual = [
    `Scope this as Milestone ${index + 1} with defined acceptance criteria and a reviewable demo on the ${projectType}.`,
    `Implement in ${primary} with clean module boundaries — you get repo access from day one and progress updates every 2–3 days.`,
    `Map directly to your ${projectType} roadmap: delivered, tested, and documented before moving to the next priority.`,
    `Address this with ${primary} + ${secondary}, aligned to your stated timeline and reviewed with you before sign-off.`
  ];

  return contextual[index % contextual.length];
}

function buildPhases(projectType, stack, parsed) {
  const tl = parsed.timeline;
  return [
    {
      title: 'Discovery & Scope',
      description: `Confirm requirements, map user flows, finalize ${stack.slice(0, 2).join(' + ')} architecture, and agree on milestone acceptance criteria.${tl ? ` Target: ${tl}.` : ''}`
    },
    {
      title: 'Core Build',
      description: `Develop primary ${projectType} features with staging demos after each sprint. Your feedback shapes the next iteration.`
    },
    {
      title: 'Integration & Hardening',
      description: 'Wire third-party services, handle edge cases, security review, and cross-browser/device testing.'
    },
    {
      title: 'Launch & Transfer',
      description: 'Production deployment, documentation, knowledge transfer, and full source code + asset handover to you.'
    }
  ];
}

function buildTimeline(phases, jobTimeline) {
  const weekMap = jobTimeline?.match(/(\d+)/);
  const totalWeeks = weekMap ? Math.max(parseInt(weekMap[1], 10), 4) : 8;
  const perPhase = Math.max(1, Math.floor(totalWeeks / phases.length));

  return phases.map((p, i) => ({
    phase: p.title,
    duration: `Week ${i * perPhase + 1}–${(i + 1) * perPhase}`,
    output: p.description.split('.')[0]
  }));
}

function buildDeliverables(projectType, stack, parsed) {
  const items = [
    `Production-ready ${projectType}`,
    `Full source code (${stack.slice(0, 2).join(', ')}) in your repository`,
    'Architecture overview and setup documentation',
    'Deployed staging and production environments'
  ];
  if (/api|backend/.test(projectType)) items.push('API documentation with example requests');
  if (/mobile/.test(projectType)) items.push('Test build for iOS and Android');
  if (/ai|automation/.test(projectType)) items.push('Automation runbook with monitoring notes');
  items.push('30-day post-launch defect support');
  return items.slice(0, 6);
}

function buildWhyMe(stack, skills, projectType, parsed) {
  const points = [
    'You work directly with the developer who writes the code — no account manager, no hidden team',
    '56+ public repositories: full-stack apps, AI integrations, Shopify, and client production work',
    `Active production experience with ${stack.slice(0, 3).join(', ')}`
  ];

  const matched = skills.filter(s =>
    stack.some(t => t.toLowerCase().includes(s.toLowerCase().slice(0, 4)))
  );

  if (matched.length) {
    points.push(`Your stack requirements (${matched.slice(0, 3).join(', ')}) align with my current projects`);
  } else {
    points.push(`Early working demo on your ${projectType} — validate direction before final milestone`);
  }

  return points.slice(0, 4);
}

function buildClosing(projectType, timeline) {
  const tl = timeline ? ` I can align to your ${timeline} timeline.` : '';
  return `Ready to begin with a brief scope call and a relevant portfolio demo within the first week.${tl} Message me on Upwork to proceed.`;
}

function buildDemoPlan(projectType, stack, title, reqs) {
  const primary = stack[0] || 'your stack';
  const focus = reqs[0] ? truncate(reqs[0], 50) : `core ${projectType} flow`;

  const itemsByType = {
    'mobile application': [
      `Interactive prototype of ${focus}`,
      'One live API connection with real data',
      'Installable test build on your device'
    ],
    'backend system': [
      `Working API covering ${focus}`,
      'Postman collection and environment setup',
      'Deployed staging endpoint you can test immediately'
    ],
    'automation solution': [
      `Script processing sample data for ${focus}`,
      'Logged output with error handling demonstrated',
      'Scheduled or triggered run on a real scenario'
    ],
    'AI-powered application': [
      `Working prompt pipeline for ${focus}`,
      'Sample inputs/outputs with cost estimate',
      'Documented fallback when the model fails'
    ],
    'e-commerce platform': [
      'Product browse and checkout on staging',
      'One payment or inquiry flow end-to-end',
      'Mobile-responsive page you can share with stakeholders'
    ],
    'SaaS product': [
      'Auth + one core feature working on staging',
      `Data model for ${focus} implemented`,
      'Admin view of key metrics or records'
    ]
  };

  const items = itemsByType[projectType] || [
    `Live UI demonstrating ${focus}`,
    `${primary} backend with correct data structure`,
    'Deployed preview link within the first milestone'
  ];

  return {
    title: `Proof of approach: ${truncate(title, 40)}`,
    description: `Within the first milestone, I deliver a working slice — not mockups — so you can evaluate architecture, code quality, and fit before committing to the full build.`,
    items
  };
}

function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1).trim() + '…' : s;
}
