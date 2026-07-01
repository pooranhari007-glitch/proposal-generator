async function generateWithAI(jobPost, settings, includeTimeline = false) {
  const { apiKey, prompts, model, profile } = settings;
  if (!apiKey) throw new Error('Add your OpenAI API key in Settings to use AI mode.');

  const userPrompt = prompts.user.replace('{{JOB_POST}}', jobPost);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: prompts.system },
        { role: 'user', content: userPrompt }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI API error (${response.status})`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from AI');

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('AI returned invalid JSON');
    parsed = JSON.parse(match[0]);
  }

  return normalizeProposal(parsed, profile, includeTimeline);
}

function normalizeProposal(data, profile, includeTimeline = false) {
  return {
    projectTitle: data.projectTitle || 'Software Development Proposal',
    coverHeadline: data.coverHeadline || 'Your <span>Project</span>',
    tags: Array.isArray(data.tags) ? data.tags.slice(0, 4) : (Array.isArray(data.techStack) ? data.techStack.slice(0, 4) : []),
    requirements: Array.isArray(data.requirements) ? data.requirements.slice(0, 3) : [],
    deliverables: Array.isArray(data.deliverables) ? data.deliverables.slice(0, 3) : [],
    timeline: includeTimeline && Array.isArray(data.timeline) ? data.timeline.slice(0, 3) : [],
    includeTimeline,
    closingNote: data.closingNote || '',
    profile
  };
}
