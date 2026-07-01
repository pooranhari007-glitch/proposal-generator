function generateFromTemplate(parsed, profile) {
  const {
    title, requirements, techStack, projectType, skills,
    goals, painPoints, timeline, constraints
  } = parsed;

  const stack = techStack.length ? techStack : inferStackFromType(projectType);

  const reqs = (requirements.length ? requirements : defaultRequirements(projectType)).slice(0, 4);

  const requirementItems = reqs.map((req, i) => ({
    requirement: req,
    response: templateResponse(req, stack, projectType, parsed, i)
  }));

  const phases = buildPhases(projectType, stack, parsed);
  const timelineRows = parsed.includeTimeline ? buildTimeline(phases, timeline) : [];
  const headline = buildHeadline(title);

  return {
    projectTitle: title,
    coverHeadline: headline,
    coverSubtitle: buildCoverSubtitle(projectType, goals),
    tags: stack.slice(0, 4),
    understandingLead: buildUnderstanding(goals, painPoints, title),
    requirements: requirementItems,
    strategyOverview: buildStrategy(projectType, goals),
    phases: parsed.includeTimeline ? [] : phases,
    techStack: stack.slice(0, 6),
    deliverables: buildDeliverables(projectType, stack, parsed),
    timeline: timelineRows,
    includeTimeline: parsed.includeTimeline,
    closingNote: buildClosing(timeline),
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
    `Production-ready ${type} aligned to your scope`,
    'Clean handover with docs and full source ownership'
  ];
}

function buildHeadline(title) {
  const short = title.length > 42 ? title.slice(0, 40) + '…' : title;
  return `A focused plan for <span>${escapeHtml(short)}</span>`;
}

function buildCoverSubtitle(projectType, goals) {
  if (goals[0]) return truncate(goals[0], 100);
  return `A clear plan for your ${projectType} — direct with me, no agency layers.`;
}

function buildUnderstanding(goals, painPoints, title) {
  if (goals[0] && painPoints[0]) {
    return `You need ${truncate(title.toLowerCase(), 60)} — specifically ${truncate(goals[0].toLowerCase(), 80)}. ${truncate(painPoints[0], 70)}.`;
  }
  if (goals[0]) return `You need ${truncate(title.toLowerCase(), 60)} focused on ${truncate(goals[0].toLowerCase(), 100)}.`;
  return `Here's how I'd handle ${truncate(title.toLowerCase(), 80)} — point by point below.`;
}

function buildStrategy(projectType, goals) {
  if (goals[0]) {
    return `I'll build this as a ${projectType} focused on ${truncate(goals[0].toLowerCase(), 80)} — working increments you review before we move on.`;
  }
  return `I'll build this in working increments you review before we move on — no surprises at the end.`;
}

function buildPhases(projectType, stack, parsed) {
  const tl = parsed.timeline;
  return [
    {
      title: 'Scope & Setup',
      description: `Align on requirements and ${stack.slice(0, 2).join(' + ')}.${tl ? ` Target: ${tl}.` : ''}`
    },
    {
      title: 'Build & Review',
      description: `Core ${projectType} features on staging — you review, I adjust.`
    },
    {
      title: 'Launch & Handover',
      description: 'Deploy, docs, and full code transfer to you.'
    }
  ];
}

function templateResponse(req, stack, projectType, parsed, index) {
  const lower = req.toLowerCase();
  const primary = stack[0] || 'the agreed stack';
  const secondary = stack[1] || 'supporting services';

  const rules = [
    [/stripe|payment|billing|checkout|subscription/, () =>
      `${/stripe/i.test(req) ? 'Stripe' : 'Payment'} flows with webhooks tested before go-live.`],
    [/api|integrat|webhook|third.party|connect/, () =>
      `REST endpoints with typed contracts and end-to-end integration tests.`],
    [/auth|login|user|signup|register|oauth/, () =>
      `Secure auth with roles and password reset — OWASP basics covered.`],
    [/ui|ux|design|responsive|frontend|react|vue|angular|mobile/, () =>
      `Mobile-first UI in ${primary} — accessible and fast on real devices.`],
    [/database|data|sql|mongo|postgres|schema|migration/, () =>
      `Clean schema, migrations, and indexes in ${/postgres/i.test(req) ? 'PostgreSQL' : secondary}.`],
    [/deploy|host|aws|docker|ci|devops|server|infrastructure/, () =>
      `Staging + production with CI — you keep full control of hosting.`],
    [/ai|ml|chatbot|openai|gpt|llm|automation|scraper|bot/, () =>
      `Reliable automation with error handling, rate limits, and cost controls.`],
    [/test|qa|quality|bug/, () =>
      `Tests on critical paths plus a QA sign-off each milestone.`],
    [/seo|performance|speed|optim/, () =>
      `Performance benchmarks and Core Web Vitals before launch.`],
    [/admin|dashboard|portal|crm|report/, () =>
      `Admin views with filtering and export — built for daily use.`],
    [/migrat|legacy|refactor|rewrite/, () =>
      `Phased migration with rollback at each step.`],
    [/document|readme|handover|training/, () =>
      `Setup docs and a walkthrough so your team can maintain it.`]
  ];

  for (const [pattern, fn] of rules) {
    if (pattern.test(lower)) return fn();
  }

  return `I'll handle this in ${primary} — scoped, tested, and reviewed with you before sign-off.`;
}

function buildTimeline(phases, jobTimeline) {
  const weekMap = jobTimeline?.match(/(\d+)/);
  const totalWeeks = weekMap ? Math.max(parseInt(weekMap[1], 10), 4) : 8;
  const perPhase = Math.max(1, Math.floor(totalWeeks / phases.length));

  return phases.map((p, i) => ({
    phase: p.title,
    duration: `Week ${i * perPhase + 1}–${(i + 1) * perPhase}`,
    output: p.description
  }));
}

function buildDeliverables(projectType, stack, parsed) {
  const items = [
    `Working ${projectType} in your repo`,
    'Staging + production deployment'
  ];
  if (/api|backend/.test(projectType)) items.push('API docs with examples');
  else if (/mobile/.test(projectType)) items.push('Test builds for iOS/Android');
  else items.push(`Source in ${stack[0] || 'your stack'}`);
  items.push('30-day post-launch support');
  return items.slice(0, 4);
}

function buildClosing(timeline) {
  const tl = timeline ? ` Happy to align to ${timeline}.` : '';
  return `Message me on Upwork to get started.${tl}`;
}

function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1).trim() + '…' : s;
}
