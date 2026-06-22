function parseJobPost(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const lower = text.toLowerCase();

  const title = extractTitle(lines, text);
  const requirements = extractRequirements(text);
  const techStack = detectTech(lower);
  const projectType = detectProjectType(lower);
  const skills = extractSkills(text);

  return { title, requirements, techStack, projectType, skills, raw: text };
}

function extractTitle(lines, text) {
  const patterns = [
    /(?:looking for|need|seeking|hiring)\s+(?:a\s+)?(.{10,80})/i,
    /(?:title|position|role):\s*(.+)/i,
    /^(.{15,90})$/m
  ];

  for (const p of patterns) {
    const m = text.match(p);
    if (m) return cleanTitle(m[1]);
  }

  return cleanTitle(lines[0] || 'Custom Software Project');
}

function cleanTitle(s) {
  return s
    .replace(/[•\-–—*#]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

function extractRequirements(text) {
  const reqs = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    const bullet = trimmed.match(/^(?:[-•*]|\d+[.)])\s+(.+)/);
    if (bullet && bullet[1].length > 15) {
      reqs.push(bullet[1].trim());
    }
  }

  if (reqs.length < 3) {
    const sentences = text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 30 && s.length < 200);

    const keywords = /must|need|require|should|looking|experience|build|develop|integrate|implement/i;
    for (const s of sentences) {
      if (keywords.test(s) && !reqs.includes(s)) reqs.push(s);
    }
  }

  return reqs.slice(0, 8);
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
  if (/ai|machine learning|llm|chatbot|openai/.test(lower)) return 'AI-powered application';
  if (/dashboard|portal|crm|admin/.test(lower)) return 'web portal';
  if (/e-?commerce|shopify|woocommerce|store/.test(lower)) return 'e-commerce platform';
  if (/saas|subscription|multi-tenant/.test(lower)) return 'SaaS product';
  return 'web application';
}

function extractSkills(text) {
  const section = text.match(/(?:skills?|requirements?|must have|qualifications?)[:\s]*([\s\S]{0,800})/i);
  if (!section) return [];
  return section[1]
    .split(/[,;\n•]/)
    .map(s => s.trim())
    .filter(s => s.length > 2 && s.length < 50)
    .slice(0, 8);
}
