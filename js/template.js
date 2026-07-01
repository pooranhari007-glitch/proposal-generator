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
  const timelineRows = parsed.includeTimeline ? buildTimeline(phases, timeline) : [];
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
    timeline: timelineRows,
    includeTimeline: parsed.includeTimeline,
    closingNote: buildClosing(projectType, timeline),
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
  const stackList = stack.slice(0, 3).join(', ');
  const goalLine = goals[0]
    ? ` Everything I build will point at your goal: ${truncate(goals[0].toLowerCase(), 90)}.`
    : '';
  return `Here's how I'd approach your ${projectType}: I'll keep the frontend, backend, and data layer cleanly separated using ${stackList}, so the system stays maintainable as your needs grow.${goalLine} You'll get working builds to review at each step — I'll walk you through what I did and why, one-to-one.`;
}

function buildPhases(projectType, stack, parsed) {
  const tl = parsed.timeline;
  const stackPair = stack.slice(0, 2).join(' and ');
  return [
    {
      title: 'Discovery & Scope',
      description: `I'll start by confirming your requirements with you, mapping the key user flows, and finalizing the ${stackPair} setup.${tl ? ` I'll align to your ${tl} timeline from day one.` : ''} We agree on clear acceptance criteria before I write code — so we're on the same page.`
    },
    {
      title: 'Core Build',
      description: `I'll build the main ${projectType} features and share staging links with you after each sprint. You tell me what to adjust — I iterate until it matches what you had in mind.`
    },
    {
      title: 'Integration & Hardening',
      description: `I'll wire up third-party services, handle edge cases, and run security and cross-device checks. I'll flag anything that needs your input before we go live.`
    },
    {
      title: 'Launch & Transfer',
      description: `I'll deploy to production, hand over full source code and docs, and walk you through everything so you own it completely — not just receive files.`
    }
  ];
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

function buildClosing(projectType, timeline) {
  const tl = timeline ? ` I can align to your ${timeline} timeline.` : '';
  return `Ready to begin with a brief scope call within the first week.${tl} Message me on Upwork to proceed.`;
}

function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1).trim() + '…' : s;
}
