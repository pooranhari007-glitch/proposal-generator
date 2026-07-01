function renderProposal(data) {
  const p = data.profile || DEFAULT_PROFILE;
  const brand = escapeHtml(p.brand || p.name || 'Veena');

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
          <div class="brief-brand">${brand}</div>
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
          <p><strong>Let's chat further</strong> — message me on Upwork.</p>
          <span class="brief-name">${escapeHtml(p.name)} · ${escapeHtml(p.year)}</span>
        </div>
      </div>
    </div>
  `;
}
