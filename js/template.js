function generateFromTemplate(parsed, profile) {
  const { title, requirements, techStack, projectType, skills } = parsed;
  const stack = techStack.length ? techStack : ['JavaScript', 'Python', 'React', 'Node.js'];
  const tags = [...new Set([...stack.slice(0, 6), projectType.split(' ')[0]])].slice(0, 8);

  const reqs = (requirements.length ? requirements : [
    'Deliver a production-ready solution aligned with the job scope',
    'Clean, maintainable code with documentation',
    'Regular progress updates and milestone demos',
    'Deployment and handover with full source code ownership'
  ]).slice(0, 6);

  const requirementItems = reqs.map((req, i) => ({
    requirement: req,
    response: templateResponse(req, stack, projectType, i)
  }));

  const phases = buildPhases(projectType);
  const timeline = phases.map((p, i) => ({
    phase: p.title,
    duration: `Week ${i * 2 + 1}–${i * 2 + 2}`,
    output: p.description.split('.')[0]
  }));

  const headline = buildHeadline(title, projectType);

  return {
    projectTitle: title,
    coverHeadline: headline,
    coverSubtitle: `Tailored ${projectType} development — direct communication, milestone delivery, and code you fully own. I build with ${stack.slice(0, 3).join(', ')} and ship working demos early.`,
    tags,
    understandingLead: `I've reviewed your requirements for this ${projectType} project. You need someone who can translate the brief into a reliable, maintainable product — not an agency that hands work to hidden juniors. Below is how I would approach your specific needs.`,
    requirements: requirementItems,
    strategyOverview: `I will architect a ${projectType} using ${stack.slice(0, 4).join(', ')} — focused on clean separation of concerns, testable modules, and incremental delivery. Each milestone ships a working demo so you can validate direction before we move forward.`,
    phases,
    techStack: stack,
    deliverables: buildDeliverables(projectType, stack),
    whyMePoints: buildWhyMe(stack, skills, projectType),
    timeline,
    closingNote: `I'm ready to start with a quick scope call and share a relevant demo from my GitHub portfolio within the first week.`,
    demoPlan: buildDemoPlan(projectType, stack, title),
    profile
  };
}

function buildDemoPlan(projectType, stack, title) {
  const primary = stack[0] || 'your stack';
  const shortTitle = title.length > 40 ? 'Core flow preview' : `${title.split(' ').slice(0, 3).join(' ')} demo`;

  const itemsByType = {
    'mobile application': [
      'Clickable screen flow for the main user journey',
      'API hook-up for one real data endpoint',
      'Test build installable on your device'
    ],
    'backend system': [
      'Live API with 2–3 core endpoints and sample data',
      'Postman collection + short README',
      'Deployed staging URL you can hit immediately'
    ],
    'automation solution': [
      'Script running against sample input/output',
      'Error logs and retry behavior documented',
      'Schedule or trigger wired for one real scenario'
    ],
    'AI-powered application': [
      'Prompt + guardrails wired to one use case',
      'Sample inputs/outputs with cost estimate',
      'Fallback path when the model fails'
    ],
    'e-commerce platform': [
      'Product listing + cart/checkout on staging',
      'One payment or inquiry flow wired end-to-end',
      'Mobile-responsive product page you can share'
    ]
  };

  const items = itemsByType[projectType] || [
    `Working UI slice of the main ${projectType} flow`,
    `${primary} backend stub with real data shape`,
    'Deployed preview link + repo access within the first milestone'
  ];

  return {
    title: shortTitle,
    description: `Before the full build, I ship a small live demo so you can validate direction early — not slides, working code on ${primary}.`,
    items
  };
}

function buildHeadline(title, projectType) {
  const short = title.length > 45 ? title.slice(0, 42) + '…' : title;
  return `Your <span>${escapeHtml(short)}</span> — Built Right`;
}

function templateResponse(req, stack, projectType, index) {
  const lower = req.toLowerCase();
  const primary = stack[0] || 'modern stack';

  if (/api|integrat|webhook|stripe|payment/.test(lower)) {
    return `Design secure API endpoints and third-party integrations with proper error handling, logging, and documentation — tested against real scenarios before go-live.`;
  }
  if (/ui|ux|design|responsive|frontend|react|vue|angular/.test(lower)) {
    return `Build a polished, mobile-first interface using ${primary} with reusable components, accessibility basics, and performance optimization.`;
  }
  if (/database|data|sql|mongo|postgres/.test(lower)) {
    return `Model the data layer with clear schemas, migrations, and backup strategy — optimized queries and sane indexing from day one.`;
  }
  if (/deploy|host|aws|docker|ci|devops/.test(lower)) {
    return `Set up deployment pipeline with environment configs, staging preview, and documented runbook so you're never locked to me for hosting.`;
  }
  if (/ai|ml|chatbot|openai|automation/.test(lower)) {
    return `Implement practical AI/automation — prompt design, guardrails, fallbacks, and cost controls — not hype features that break in production.`;
  }
  if (/test|qa|quality/.test(lower)) {
    return `Add unit and integration tests on critical paths, plus a manual QA checklist before each milestone sign-off.`;
  }

  const templates = [
    `Break this into a clear milestone with a demo link so you see progress on the ${projectType} before final payment.`,
    `Implement using ${primary} following industry patterns — readable code, inline comments on complex logic, and handover docs.`,
    `Align with your existing workflow: daily/async updates, shared repo access, and direct developer contact (no middleman).`,
    `Prioritize this in Phase ${index + 1} of the build plan with a defined acceptance criteria we agree on upfront.`
  ];

  return templates[index % templates.length];
}

function buildPhases(projectType) {
  return [
    {
      title: 'Discovery & Architecture',
      description: 'Review requirements, confirm scope, wireframe key flows, and agree on tech stack and milestone plan.'
    },
    {
      title: 'Core Build',
      description: `Develop the main ${projectType} features with weekly demo links and your feedback incorporated each cycle.`
    },
    {
      title: 'Integration & Polish',
      description: 'Connect APIs, third-party services, edge cases, performance tuning, and cross-device testing.'
    },
    {
      title: 'Launch & Handover',
      description: 'Production deployment, documentation, training walkthrough, and full source code transfer to you.'
    }
  ];
}

function buildDeliverables(projectType, stack) {
  return [
    `Fully functional ${projectType}`,
    `Source code in your GitHub repo (${stack.slice(0, 2).join(' + ')})`,
    'Technical documentation & setup guide',
    'Deployment on your preferred hosting',
    '30-day post-launch bug-fix support'
  ];
}

function buildWhyMe(stack, skills, projectType) {
  const points = [
    `Direct developer access — I write the code myself, no outsourced team`,
    `56+ GitHub repos including full-stack apps, AI middleware, and production client work`,
    `Experience with ${stack.slice(0, 3).join(', ')} on real projects`
  ];

  if (skills.length) {
    points.push(`Your required skills (${skills.slice(0, 3).join(', ')}) match my active stack`);
  } else {
    points.push(`Early demo delivery — see a working ${projectType} preview before final milestone`);
  }

  return points.slice(0, 4);
}
