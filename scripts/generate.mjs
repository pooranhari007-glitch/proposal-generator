#!/usr/bin/env node
/**
 * Headless proposal generator — template mode, no API key.
 * Usage:
 *   node scripts/generate.mjs "job post text..."
 *   cat job.txt | node scripts/generate.mjs
 *   node scripts/generate.mjs --file job.txt --open
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadModules() {
  const configCode = fs.readFileSync(path.join(root, 'js/config.js'), 'utf8');
  const parserCode = fs.readFileSync(path.join(root, 'js/parser.js'), 'utf8');
  const templateCode = fs.readFileSync(path.join(root, 'js/template.js'), 'utf8');
  const renderCode = fs.readFileSync(path.join(root, 'js/render.js'), 'utf8');

  const factory = new Function(`
    ${configCode}
    ${parserCode}
    ${templateCode}
    ${renderCode}
    return { DEFAULT_PROFILE, parseJobPost, generateFromTemplate, renderProposal };
  `);

  return factory();
}

const { DEFAULT_PROFILE, parseJobPost, generateFromTemplate, renderProposal } = loadModules();

function parseArgs(argv) {
  const opts = { file: null, open: false, out: null };
  const positional = [];
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--file' && argv[i + 1]) opts.file = argv[++i];
    else if (argv[i] === '--out' && argv[i + 1]) opts.out = argv[++i];
    else if (argv[i] === '--open') opts.open = true;
    else positional.push(argv[i]);
  }
  opts.text = positional.join(' ').trim();
  return opts;
}

function buildCoverNote(proposal) {
  const tasks = (proposal.task || []).slice(0, 2).join('; ');
  return `I've attached a proposal covering: ${tasks}. My approach is detailed in the PDF. Let's chat further on Upwork or email. — Veena Dev`;
}

async function main() {
  const opts = parseArgs(process.argv);
  let jobPost = opts.text;

  if (opts.file) {
    jobPost = fs.readFileSync(path.resolve(opts.file), 'utf8').trim();
  }

  if (!jobPost && !process.stdin.isTTY) {
    jobPost = fs.readFileSync(0, 'utf8').trim();
  }

  if (!jobPost) {
    console.error('Usage: node scripts/generate.mjs "job post text"');
    console.error('       cat job.txt | node scripts/generate.mjs');
    process.exit(1);
  }

  const parsed = parseJobPost(jobPost);
  const proposal = generateFromTemplate(parsed, DEFAULT_PROFILE);
  const body = renderProposal(proposal);
  const css = fs.readFileSync(path.join(root, 'css/proposal.css'), 'utf8');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${proposal.projectTitle} — Proposal</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body style="margin:0;background:#334155;padding:24px;">
  ${body}
</body>
</html>`;

  const slug = proposal.projectTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'proposal';

  const outDir = path.join(root, 'output');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = opts.out || path.join(outDir, `${slug}-proposal.html`);
  fs.writeFileSync(outPath, html);

  console.log(`\n✓ Proposal generated: ${outPath}`);
  console.log(`  Project: ${proposal.projectTitle}`);
  console.log(`  Requirements addressed: ${proposal.requirements.length}`);
  console.log(`\n--- Upwork cover note (paste with PDF) ---\n${buildCoverNote(proposal)}\n`);

  if (opts.open && process.platform === 'darwin') {
    execSync(`open "${outPath}"`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
