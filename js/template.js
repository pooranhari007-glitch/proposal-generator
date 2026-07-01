function generateFromTemplate(parsed, profile) {
  const { title, requirements, techStack, projectType, timeline } = parsed;

  const stack = techStack.length ? techStack : inferStackFromType(projectType);
  const reqs = filterRequirements(requirements, title, projectType).slice(0, 3);
  const requirementItems = buildRequirementItems(reqs, stack, projectType);
  const phases = buildPhases(projectType, stack, parsed);
  const timelineRows = parsed.includeTimeline ? buildTimeline(phases, timeline) : [];

  return {
    projectTitle: title,
    coverHeadline: buildHeadline(title),
    tags: stack.slice(0, 4),
    requirements: requirementItems,
    techStack: stack.slice(0, 5),
    deliverables: buildDeliverables(projectType, stack),
    timeline: timelineRows,
    includeTimeline: parsed.includeTimeline,
    closingNote: buildClosing(timeline),
    profile
  };
}

function filterRequirements(requirements, title, projectType) {
  const titleKey = title.toLowerCase().slice(0, 25);
  const defaults = defaultRequirements(projectType);
  const filtered = (requirements.length ? requirements : defaults).filter((req) => {
    const lower = req.toLowerCase();
    if (req.length > 90) return false;
    if (/^looking for|^seeking|^hiring|^we are looking/i.test(req)) return false;
    if (lower === title.toLowerCase()) return false;
    if (titleKey.length > 12 && lower.startsWith(titleKey)) return false;
    return true;
  });
  return filtered.length ? dedupe(filtered) : defaults;
}

function buildRequirementItems(reqs, stack, projectType) {
  const used = new Set();
  return reqs.map((req, i) => {
    let response = templateResponse(req, stack, projectType, i);
    if (used.has(response)) {
      response = `Covered in ${stack[0] || 'the build'} — tested and signed off with you.`;
    }
    used.add(response);
    return { requirement: req, response };
  });
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
    `Deliver a production-ready ${type}`,
    'Hand over source code and documentation'
  ];
}

function buildHeadline(title) {
  const short = title.length > 42 ? title.slice(0, 40) + '…' : title;
  return `Proposal for <span>${escapeHtml(short)}</span>`;
}

function buildPhases(projectType, stack, parsed) {
  const tl = parsed.timeline;
  return [
    { title: 'Scope', duration: tl ? `Wk 1` : 'Week 1', output: `Lock requirements & ${stack[0] || 'stack'}` },
    { title: 'Build', duration: tl ? `Wk 2–3` : 'Week 2–4', output: `Core ${projectType} on staging` },
    { title: 'Ship', duration: tl ? `Wk 4+` : 'Week 5+', output: 'Deploy + handover' }
  ];
}

function templateResponse(req, stack, projectType, index) {
  const lower = req.toLowerCase();
  const primary = stack[0] || 'the agreed stack';

  const rules = [
    [/stripe|payment|billing|checkout/, () => 'Stripe/payment flows with webhook testing.'],
    [/webhook/, () => 'Webhook handlers with retries and logging.'],
    [/aws|deploy|host|docker|ci|devops|infrastructure/, () => 'AWS deploy with staging + production.'],
    [/api|integrat|third.party|connect/, () => 'REST API with typed contracts and tests.'],
    [/auth|login|signup|oauth/, () => 'Auth with roles and secure sessions.'],
    [/ui|ux|frontend|react|vue|mobile|responsive/, () => `UI in ${primary} — mobile-first.`],
    [/database|postgres|mongo|sql|schema/, () => `Data layer in ${stack[1] || primary}.`],
    [/django|flask|fastapi|python/, () => `Backend in Python — clean and documented.`],
    [/automation|scraper|bot|llm|ai|openai/, () => 'Automation with error handling and rate limits.'],
    [/test|qa|bug/, () => 'Tests on critical paths before each milestone.'],
    [/admin|dashboard|portal|crm/, () => 'Admin panel with filters and export.'],
    [/document|handover|training/, () => 'Docs + walkthrough for your team.']
  ];

  for (const [pattern, fn] of rules) {
    if (pattern.test(lower)) return fn();
  }

  const fallbacks = [
    `Built in ${primary}, reviewed with you before sign-off.`,
    'Scoped, tested, and delivered in your repo.',
    'Handled end-to-end — no subcontracting.'
  ];
  return fallbacks[index % fallbacks.length];
}

function buildTimeline(phases, jobTimeline) {
  const weekMatch = jobTimeline?.match(/(\d+)/);
  if (!weekMatch) return phases;

  const total = Math.max(parseInt(weekMatch[1], 10), 3);
  const chunk = Math.max(1, Math.floor(total / phases.length));
  return phases.map((p, i) => ({
    ...p,
    duration: `Week ${i * chunk + 1}–${Math.min((i + 1) * chunk, total)}`
  }));
}

function buildDeliverables(projectType, stack) {
  return [
    `${capitalize(projectType)} in your repo`,
    stack[0] ? `Built with ${stack.slice(0, 2).join(' + ')}` : 'Full source code',
    /api|backend|automation/.test(projectType) ? 'API docs + deployment' : 'Deployed staging environment'
  ];
}

function buildClosing(timeline) {
  return timeline
    ? `Message me on Upwork — I can work within ${timeline}.`
    : 'Message me on Upwork to get started.';
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
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
