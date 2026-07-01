function renderProposal(data) {
  const p = data.profile || DEFAULT_PROFILE;
  const brandParts = (p.brand || 'Veena Dev').split(' ');
  const brandHtml = brandParts[1]
    ? `${escapeHtml(brandParts[0])} <span>${escapeHtml(brandParts[1])}</span>`
    : escapeHtml(p.brand || p.name);

  const taskItems = (data.task || []).map(t => `<li>${escapeHtml(t)}</li>`).join('');
  const timelineRows = (data.timeline || []).map(t => `
    <tr>
      <td>${escapeHtml(t.title || t.phase)}</td>
      <td>${escapeHtml(t.duration)}</td>
      <td>${escapeHtml(t.output)}</td>
    </tr>
  `).join('');

  const timelineBlock = data.includeTimeline && timelineRows ? `
    <table class="brief-table">
      <thead><tr><th>Phase</th><th>When</th><th>Output</th></tr></thead>
      <tbody>${timelineRows}</tbody>
    </table>` : '';

  return `
    <div class="proposal-doc">
      <div class="page brief-page">
        <div class="brief-header">
          <div class="brief-brand">${brandHtml}</div>
          <div class="brief-contact">
            <span>${escapeHtml(p.upwork)}</span>
            <span>${escapeHtml(p.github)}</span>
          </div>
        </div>

        <h1 class="brief-title">${escapeHtml(data.projectTitle)}</h1>

        <div class="brief-block">
          <h2>Task</h2>
          <ul class="brief-list">${taskItems}</ul>
        </div>

        <div class="brief-block">
          <h2>My proposal solution</h2>
          <p>${escapeHtml(data.solution)}</p>
        </div>

        ${timelineBlock}

        <div class="brief-cta">
          <p><strong>Let's chat further</strong> — message me on Upwork or email.</p>
          <span class="brief-name">${escapeHtml(p.name)} · ${escapeHtml(p.brand || 'Veena Dev')} · ${escapeHtml(p.year)}</span>
        </div>
      </div>
    </div>
  `;
}
