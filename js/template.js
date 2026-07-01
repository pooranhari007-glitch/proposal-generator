function generateFromTemplate(parsed, profile) {
  const { title, requirements, techStack, projectType } = parsed;

  const stack = techStack.length ? techStack : inferStackFromType(projectType);
  const reqs = filterRequirements(requirements, title, projectType).slice(0, 4);

  return {
    projectTitle: title,
    coverHeadline: buildHeadline(title),
    tags: stack.slice(0, 4),
    task: reqs.map((r) => truncate(r, 120)),
    solution: buildSolution(stack, projectType, parsed),
    deliverables: buildDeliverables(projectType, stack),
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
    if (/\$|budget|price|rate|hourly|fixed cost/i.test(req)) return false;
    return true;
  });
  return filtered.length ? dedupe(filtered) : defaults;
}

function buildHeadline(title) {
  if (!isGoodTitle(title)) title = 'Your Project';
  const short = title.length > 42 ? title.slice(0, 40) + '…' : title;
  return `<span>${escapeHtml(short)}</span>`;
}

function buildSolution(stack, projectType, parsed) {
  const stackNote = stack.slice(0, 3).join(', ');
  const focus = solutionFocus(parsed.raw || '', stack, projectType);
  return `I'll build this as a ${projectType} on ${stackNote}. ${focus} You work directly with me — I share staging builds as we go, you review, I adjust. No agency handoffs.`;
}

function solutionFocus(text, stack, projectType) {
  const lower = text.toLowerCase();
  if (/webhook|api|integrat/.test(lower)) return 'Clean API layer with tested integrations and documented endpoints.';
  if (/aws|deploy|cloud|host/.test(lower)) return 'Staging and production setup you control, with CI so deploys stay predictable.';
  if (/ai|openai|gpt|automation|bot/.test(lower)) return 'Reliable automation with clear inputs/outputs, error handling, and cost-aware design.';
  if (/mobile|ios|android|react native/.test(lower)) return 'Mobile-first build tested on real devices before you sign off.';
  if (/ui|frontend|react|vue|dashboard/.test(lower)) return 'Polished interface in ' + (stack[0] || 'your stack') + ', component-based and easy to extend.';
  if (/database|postgres|mongo|sql/.test(lower)) return 'Solid data model with migrations and a schema your team can maintain.';
  if (/auth|login|user/.test(lower)) return 'Secure auth and role-based access from day one.';
  return 'Modular architecture so each piece is testable, reviewable, and yours to keep.';
}

function buildDeliverables(projectType, stack) {
  return [
    `Working ${projectType} — full source in your repository`,
    `Deployed staging environment (${stack.slice(0, 2).join(', ')})`,
    'Setup documentation and handover walkthrough'
  ];
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
  return [`Production-ready ${type}`, 'Full ownership of code and documentation'];
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
