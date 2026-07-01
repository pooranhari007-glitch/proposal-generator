function generateFromTemplate(parsed, profile) {
  const { title, requirements, techStack, projectType, timeline } = parsed;

  const stack = techStack.length ? techStack : inferStackFromType(projectType);
  const reqs = filterRequirements(requirements, title, projectType).slice(0, 4);
  const phases = buildPhases(projectType, stack, parsed);
  const timelineRows = parsed.includeTimeline ? buildTimeline(phases, timeline) : [];

  return {
    projectTitle: title,
    coverHeadline: buildHeadline(title),
    tags: stack.slice(0, 4),
    task: reqs.map((r) => truncate(r, 120)),
    solution: buildSolution(reqs, stack, projectType, timeline, parsed.includeTimeline),
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
    if (req.length > 120) return false;
    if (/^looking for|^seeking|^hiring/i.test(req)) return false;
    if (lower === title.toLowerCase()) return false;
    if (titleKey.length > 12 && lower.startsWith(titleKey)) return false;
    return true;
  });
  return filtered.length ? dedupe(filtered) : defaults;
}

function buildHeadline(title) {
  const short = title.length > 48 ? title.slice(0, 46) + '…' : title;
  return `Proposal for <span>${escapeHtml(short)}</span>`;
}

function buildSolution(reqs, stack, projectType, timeline, includeTimeline) {
  const stackNote = stack.slice(0, 3).join(', ');
  const points = reqs.map((req, i) => briefResponse(req, stack, i)).join(' ');
  const tl = includeTimeline && timeline ? ` I can work within ${timeline}.` : '';
  return `I'll build your ${projectType} using ${stackNote}. ${points} You get the code in your repo, staging to review, and full handover.${tl}`.replace(/\s+/g, ' ').trim();
}

function briefResponse(req, stack, index) {
  const lower = req.toLowerCase();
  const primary = stack[0] || 'the agreed stack';
  if (/webhook/i.test(lower)) return 'Webhooks with retries and logging.';
  if (/aws|deploy|host/i.test(lower)) return 'AWS deploy with staging and production.';
  if (/api|integrat/i.test(lower)) return 'REST API with tests and docs.';
  if (/auth|login/i.test(lower)) return 'Secure auth and roles.';
  if (/django|python/i.test(lower)) return 'Python/Django backend, clean and documented.';
  if (/database|postgres|mongo|sql/i.test(lower)) return `Data layer in ${stack[1] || primary}.`;
  if (/ui|frontend|react|mobile/i.test(lower)) return `UI in ${primary}, mobile-first.`;
  return `Handled in ${primary} with your review at each step.`;
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
  return [`Production-ready ${type}`, 'Source code and docs in your hands'];
}

function buildPhases(projectType, stack, parsed) {
  return [
    { title: 'Scope', duration: 'Week 1', output: 'Requirements agreed' },
    { title: 'Build', duration: 'Week 2–4', output: `Core ${projectType}` },
    { title: 'Ship', duration: 'Week 5+', output: 'Deploy + handover' }
  ];
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
