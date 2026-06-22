# Proposal Generator

Paste a job post → get an instant, branded PDF proposal matching your **Rajat Dev** style (blue/green, 5 pages, no email).

## Quick start

```bash
cd ~/proposal-generator
python3 -m http.server 8765
```

Open **http://localhost:8765** → paste job post → **Generate Proposal** → **Download PDF**.

## Two modes

| Mode | API key? | Best for |
|------|----------|----------|
| **Template** (default) | No | Fast proposals, most Upwork posts |
| **AI** | OpenAI key in settings | Highly tailored copy, complex briefs |

AI prompts are editable in the sidebar — use `{{JOB_POST}}` as the placeholder.

## CLI (no browser)

```bash
node scripts/generate.mjs "Looking for React developer to build..."
# or
cat job-post.txt | node scripts/generate.mjs --open
```

Output: `output/<slug>-proposal.html` — open in Chrome → Print → Save as PDF.

## What's in the PDF

1. **Cover** — project headline, tech tags, Upwork + GitHub (no email)
2. **Requirements** — each job requirement with your response
3. **Strategy** — phases, stack, quick demo plan
4. **Deliverables & timeline** — milestones + why you
5. **CTA** — message on Upwork

## Profile

Edit in the web UI sidebar: name, brand, Upwork, GitHub. Saved in browser localStorage.

## Cursor workflow

A global rule is installed: when you paste a job post in Cursor chat, the agent generates a proposal using this tool and can build a small demo when scope allows.

**Pitch line:** *"Paste any job post — it instantly builds a professional PDF proposal in my brand style: requirements addressed, strategy laid out, ready to attach on Upwork."*
