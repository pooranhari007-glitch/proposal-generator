function parseJobPost(text) {
  const { cleaned, includeTimeline } = extractProposalOptions(text);
  const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
  const lower = cleaned.toLowerCase();

  const title = extractTitle(lines, cleaned);
  const requirements = extractRequirements(cleaned);
  const techStack = detectTech(lower);
  const projectType = detectProjectType(lower);
  const skills = extractSkills(cleaned);
  const goals = extractGoals(cleaned, lower);
  const painPoints = extractPainPoints(cleaned, lower);
  const timeline = extractTimeline(cleaned);
  const constraints = extractConstraints(cleaned, lower);

  return {
    title,
    requirements,
    techStack,
    projectType,
    skills,
    goals,
    painPoints,
    timeline,
    constraints,
    includeTimeline,
    raw: cleaned
  };
}

function extractProposalOptions(text) {
  const includeTimeline = /\b(?:include|add|with|show)\s+timeline\b/i.test(text)
    || /^\s*\[timeline\]\s*$/im.test(text)
    || /^\s*\+timeline\s*$/im.test(text);

  const cleaned = text
    .replace(/^\s*(?:include|add|with|show)\s+timeline\s*$/gim, '')
    .replace(/^\s*\[timeline\]\s*$/gim, '')
    .replace(/^\s*\+timeline\s*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { cleaned, includeTimeline };
}

function extractTitle(lines, text) {
  const skip = /^(about|description|overview|summary|requirements|skills|budget|deliverables)/i;

  const patterns = [
    /(?:project|job|title|position|role)[:\s]+(.{8,90})/i,
    /(?:looking for|need|seeking|hiring|want)\s+(?:an?\s+)?(.{8,90}?)(?:\.|,|$)/i,
    /(?:build|develop|create)\s+(?:a|an)\s+(.{8,80}?)(?:\.|,|$)/i
  ];

  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const t = cleanTitle(m[1]);
      if (t.length > 8 && !skip.test(t)) return t;
    }
  }

  for (const line of lines.slice(0, 5)) {
    if (line.length > 12 && line.length < 90 && !skip.test(line) && !/^[-•*\d]/.test(line)) {
      return cleanTitle(line);
    }
  }

  return 'Custom Software Project';
}

function cleanTitle(s) {
  return s
    .replace(/[•\-–—*#]+/g, '')
    .replace(/\b(experienced|senior|junior|freelance|remote|urgent|asap)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^to\s+/i, '')
    .replace(/\s+to\s+build$/i, '')
    .slice(0, 70);
}

function extractRequirements(text) {
  const reqs = [];
  const lines = text.split('\n');
  let inReqSection = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(requirements|must have|what we need|deliverables|scope|responsibilities)/i.test(trimmed)) {
      inReqSection = true;
      continue;
    }
    if (inReqSection && /^(about|nice to have|bonus|budget|timeline)/i.test(trimmed)) {
      inReqSection = false;
    }

    const bullet = trimmed.match(/^(?:[-•*]|\d+[.)])\s+(.+)/);
    if (bullet && bullet[1].length > 12) {
      const req = cleanReq(bullet[1]);
      if (!/^looking for|^seeking|^hiring/i.test(req)) reqs.push(req);
    }
  }

  if (reqs.length < 3) {
    const sentences = text
      .split(/[.!?\n]+/)
      .map(s => cleanReq(s))
      .filter(s => s.length >= 8 && s.length < 120);

    const keywords = /must|need|require|should|build|develop|integrate|implement|deliver|create|deploy|aws|webhook|api|django|python/i;
    for (const s of sentences) {
      if (/^looking for|^seeking|^hiring/i.test(s)) continue;
      if (keywords.test(s) && !reqs.some(r => r.toLowerCase() === s.toLowerCase())) {
        reqs.push(s);
      }
    }
  }

  return dedupe(reqs).slice(0, 5);
}

function cleanReq(s) {
  return s.replace(/^[-•*\d.)\s]+/, '').replace(/\s+/g, ' ').trim();
}

function dedupe(arr) {
  const seen = new Set();
  return arr.filter(item => {
    const key = item.toLowerCase().slice(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractGoals(text, lower) {
  const goals = [];
  const patterns = [
    /(?:goal|objective|purpose|we want|looking to|need to)\s+(.{20,150})/gi,
    /(?:build|create|develop|launch)\s+(?:a|an)\s+(.{15,120})/gi
  ];

  for (const p of patterns) {
    let m;
    while ((m = p.exec(text)) !== null) {
      const g = cleanReq(m[1]);
      if (g.length > 15) goals.push(g);
    }
  }

  if (!goals.length) {
    const first = text.split(/[.!?\n]/).find(s => s.trim().length > 40);
    if (first) goals.push(cleanReq(first));
  }

  return dedupe(goals).slice(0, 3);
}

function extractPainPoints(text, lower) {
  const pains = [];
  if (/legacy|outdated|manual|slow|broken|bug|issue|problem|struggle|pain/.test(lower)) {
    const sentences = text.split(/[.!?\n]+/).filter(s =>
      /legacy|manual|slow|broken|issue|problem|struggle|inefficient|difficult/i.test(s)
    );
    pains.push(...sentences.map(cleanReq).filter(s => s.length > 20).slice(0, 2));
  }
  if (/scale|growth|increase|expand/.test(lower)) {
    pains.push('Current setup may not scale with growing demand');
  }
  return pains.slice(0, 2);
}

function extractTimeline(text) {
  const week = text.match(/(\d+)\s*weeks?/i);
  if (week) return `${week[1]} weeks`;
  const m = text.match(/(?:timeline|deadline|duration|within)\s*[:\s]*(\d+\s*(?:days?|weeks?|months?))/i);
  if (m) return cleanReq(m[1]);
  return null;
}

function extractConstraints(text, lower) {
  const c = [];
  if (/budget|fixed price|\$\d+/.test(lower)) {
    const b = text.match(/(?:budget|fixed|price)[:\s]*([^\n.]{4,40})/i);
    if (b) c.push(`Budget: ${cleanReq(b[1])}`);
  }
  if (/remote|timezone|overlap/.test(lower)) c.push('Remote collaboration with clear async updates');
  if (/nda|confidential/.test(lower)) c.push('NDA and confidentiality respected');
  return c;
}

function detectTech(lower) {
  const found = [];
  const sorted = Object.keys(TECH_KEYWORDS).sort((a, b) => b.length - a.length);

  for (const key of sorted) {
    if (lower.includes(key) && !found.includes(TECH_KEYWORDS[key])) {
      found.push(TECH_KEYWORDS[key]);
    }
  }

  return found.slice(0, 10);
}

function detectProjectType(lower) {
  if (/mobile|ios|android|react native|flutter/.test(lower)) return 'mobile application';
  if (/api|backend|microservice|server/.test(lower)) return 'backend system';
  if (/automation|scraper|crawler|bot|workflow/.test(lower)) return 'automation solution';
  if (/ai|machine learning|llm|chatbot|openai|gpt/.test(lower)) return 'AI-powered application';
  if (/dashboard|portal|crm|admin/.test(lower)) return 'web portal';
  if (/e-?commerce|shopify|woocommerce|store/.test(lower)) return 'e-commerce platform';
  if (/saas|subscription|multi-tenant/.test(lower)) return 'SaaS product';
  if (/wordpress|cms|blog/.test(lower)) return 'content platform';
  if (/landing|website|web\s*site/.test(lower)) return 'website';
  return 'web application';
}

function extractSkills(text) {
  const section = text.match(/(?:skills?|requirements?|must have|qualifications?|tech\s*stack)[:\s]*([\s\S]{0,900})/i);
  if (!section) return [];
  return section[1]
    .split(/[,;\n•|]/)
    .map(s => s.trim())
    .filter(s => s.length > 2 && s.length < 45)
    .slice(0, 10);
}
