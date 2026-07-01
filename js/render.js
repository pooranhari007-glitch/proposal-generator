function renderProposal(data) {
  const p = data.profile || DEFAULT_PROFILE;
  const brandParts = (p.brand || 'Veena Dev').split(' ');
  const pageLogo = brandParts[1]
    ? `${escapeHtml(brandParts[0])} <span>${escapeHtml(brandParts[1])}</span>`
    : escapeHtml(p.brand || p.name);

  const tags = (data.tags || []).map(t => `<span class="cover-tag">${escapeHtml(t)}</span>`).join('');
  const taskItems = (data.task || []).map(t => `<li>${escapeHtml(t)}</li>`).join('');
  const solutionRows = (data.solutionItems || []).map((item, i) => solutionRow(item.task, item.response, i + 1)).join('');
  const deliverables = (data.deliverables || []).map(d => `<li>${escapeHtml(d)}</li>`).join('');
  const timelineRows = (data.timeline || []).map(t => `
    <tr>
      <td><strong>${escapeHtml(t.title || t.phase)}</strong></td>
      <td>${escapeHtml(t.duration)}</td>
      <td>${escapeHtml(t.output)}</td>
    </tr>
  `).join('');

  const timelineBlock = data.includeTimeline && timelineRows ? `
        <div class="section-block">
          <span class="section-label">Timeline</span>
          <h2>Milestones</h2>
          <table>
            <thead><tr><th>Phase</th><th>When</th><th>Output</th></tr></thead>
            <tbody>${timelineRows}</tbody>
          </table>
        </div>` : '';

  return `
    <div class="proposal-doc">
      <div class="page cover">
        <div class="cover-top">
          <div class="cover-badge">${escapeHtml(p.badge)}</div>
          <div class="cover-year">${escapeHtml(p.year)}</div>
        </div>
        <div class="cover-main">
          <h1>${sanitizeHeadline(data.coverHeadline) || 'Your <span>Project</span>'}</h1>
          <div class="cover-tags">${tags}</div>
        </div>
        <div class="cover-bottom">
          <div class="cover-contact">
            <strong>${escapeHtml(p.name)}</strong>
            <span>${escapeHtml(p.title)}</span>
            <span>${escapeHtml(p.upwork)}</span>
            <span>${escapeHtml(p.github)}</span>
          </div>
        </div>
      </div>

      <div class="page inner">
        <div class="page-header">
          <div class="page-logo">${pageLogo}</div>
          <div class="page-num">02</div>
        </div>

        <div class="section-block">
          <span class="section-label">Task</span>
          <h2>What You Need</h2>
          <ul class="brief-list">${taskItems}</ul>
        </div>

        <div class="section-block">
          <span class="section-label">Solution</span>
          <h2>My Proposal Solution</h2>
          <p class="lead">${escapeHtml(data.solutionOverview || '')}</p>
          ${solutionRows}
        </div>

        <div class="footer-note">${escapeHtml(p.name)} · ${escapeHtml(p.brand || 'Veena Dev')}</div>
      </div>

      <div class="page inner">
        <div class="page-header">
          <div class="page-logo">${pageLogo}</div>
          <div class="page-num">03</div>
        </div>

        <div class="section-block">
          <span class="section-label">Deliverables</span>
          <h2>What You Receive</h2>
          <ul class="clean-list">${deliverables}</ul>
        </div>

        ${timelineBlock}

        <div class="brief-cta inline-cta">
          <p><strong>Let's chat further</strong> — message me on Upwork or email.</p>
        </div>

        <div class="footer-note">${escapeHtml(p.name)} · Confidential Proposal</div>
      </div>
    </div>
  `;
}

function solutionRow(task, response, num) {
  return `
    <div class="service-row">
      <div class="service-num">${String(num).padStart(2, '0')}</div>
      <div class="service-content">
        <h3>${escapeHtml(task)}</h3>
        <p>${escapeHtml(response)}</p>
      </div>
    </div>
  `;
}

function sanitizeHeadline(html) {
  if (!html) return '';
  return String(html).replace(/<(?!\/?span\b)[^>]+>/gi, '');
}
