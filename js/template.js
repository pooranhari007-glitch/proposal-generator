function generateFromTemplate(parsed, profile) {
  const { title, requirements, techStack, projectType, timeline } = parsed;

  const stack = techStack.length ? techStack : inferStackFromType(projectType);
  const reqs = filterRequirements(requirements, title, projectType).slice(0, 3);
  const requirementItems = buildRequirementItems(reqs, stack, projectType);
  const phases = buildPhases(projectType, stack, parsed);
  const timelineRows = parsed.includeTimeline ? buildTimeline(phases, timeline) : [];

  return {
    projectTitle: title,
    task: buildTask(reqs, title, projectType),
    solution: buildSolution(requirementItems, stack, projectType, timeline, parsed.includeTimeline),
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
      response = `Handled in ${stack[0] || 'the build'} with your sign-off.`;
    }
    used.add(response);
    return { requirement: req, response };
  });
}

function buildTask(reqs, title, projectType) {
  if (reqs.length) return reqs.map((r) => truncate(r, 100));
  return [truncate(title, 100) || `Production-ready ${projectType}`];
}

function buildSolution(items, stack, projectType, timeline, includeTimeline) {
  const stackNote = stack.slice(0, 3).join(', ');
  const points = items.map((i) => i.response).join(' ');
  const tl = includeTimeline && timeline ? ` I can align to ${timeline}.` : '';
  return `I'll deliver this as a ${projectType} using ${stackNote}. ${points}${tl}`.replace(/\s+/g, ' ').trim();
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
  return [`Production-ready ${type}`, 'Source code and docs handed over to you'];
}

function buildPhases(projectType, stack, parsed) {
  const tl = parsed.timeline;
  return [
    { title: 'Scope', duration: 'Week 1', output: `Requirements + ${stack[0] || 'stack'}` },
    { title: 'Build', duration: tl ? 'Week 2–3' : 'Week 2–4', output: `Core ${projectType}` },
    { title: 'Ship', duration: tl ? 'Week 4+' : 'Week 5+', output: 'Deploy + handover' }
  ];
}

function templateResponse(req, stack, projectType, index) {
  const lower = req.toLowerCase();
  const primary = stack[0] || 'the agreed stack';

  const rules = [
    [/stripe|payment|billing|checkout/, () => 'Payment flows with webhook testing.'],
    [/webhook/, () => 'Webhook handlers with retries.'],
    [/aws|deploy|host|docker|ci|devops/, () => 'AWS/staging + production deploy.'],
    [/api|integrat|third.party|connect/, () => 'REST API with tests.'],
    [/auth|login|signup|oauth/, () => 'Secure auth and roles.'],
    [/ui|ux|frontend|react|vue|mobile/, () => `UI in ${primary}.`],
    [/database|postgres|mongo|sql/, () => `Data layer in ${stack[1] || primary}.`],
    [/django|flask|fastapi|python/, () => 'Python backend, documented.'],
    [/automation|scraper|bot|llm|ai|openai/, () => 'Automation with error handling.'],
    [/test|qa|bug/, () => 'Tested before each milestone.'],
    [/admin|dashboard|portal|crm/, () => 'Admin panel with export.'],
    [/document|handover/, () => 'Docs + walkthrough.']
  ];

  for (const [pattern, fn] of rules) {
    if (pattern.test(lower)) return fn();
  }

  return `Built in ${primary}, reviewed with you.`;
}

function buildTimeline(phases, jobTimeline) {
  const weekMatch = jobTimeline?.match(/(\d+)/);
  if (!weekMatch) return phases;
  const total = Math.max(parseInt(weekMatch[1], 10), 3);
  const chunk = Math.max(1, Math.floor(total / phases.length));
  return phases.map((p, i) => ({
    ...p,
    duration: `Wk ${i * chunk + 1}–${Math.min((i + 1) * chunk, total)}`
  }));
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
