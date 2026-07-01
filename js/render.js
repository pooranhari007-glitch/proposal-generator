function renderProposal(data) {
  const p = data.profile || DEFAULT_PROFILE;
  const brandParts = (p.brand || 'Veena Dev').split(' ');
  const pageLogo = brandParts[1]
    ? `${escapeHtml(brandParts[0])} <span>${escapeHtml(brandParts[1])}</span>`
    : escapeHtml(p.brand || p.name);

  const tags = (data.tags || []).map(t => `<span class="cover-tag">${escapeHtml(t)}</span>`).join('');
  const taskItems = (data.task || []).map(t => `<li>${escapeHtml(t)}</li>`).join('');
  const deliverables = (data.deliverables || []).map(d => `<li>${escapeHtml(d)}</li>`).join('');

  return `
    <div class="proposal-doc">
      <div class="page cover">
        <div class="cover-top">
          <div class="cover-badge">${escapeHtml(p.badge)}</div>
          <div class="cover-year">${escapeHtml(p.year)}</div>
        </div>
        <div class="cover-main">
          <p class="cover-eyebrow">Proposal for</p>
          <h1>${sanitizeHeadline(data.coverHeadline) || '<span>Your Project</span>'}</h1>
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
          <span class="section-label">Scope</span>
          <h2>The Task</h2>
          <ul class="brief-list">${taskItems}</ul>
        </div>

        <div class="section-block">
          <span class="section-label">Approach</span>
          <h2>How I'll Deliver</h2>
          <p class="lead">${escapeHtml(data.solution)}</p>
        </div>

        <div class="section-block">
          <span class="section-label">Output</span>
          <h2>What You Receive</h2>
          <ul class="clean-list">${deliverables}</ul>
        </div>

        <div class="brief-cta inline-cta">
          <p><strong>Let's talk</strong> — message me on Upwork or email to discuss details.</p>
        </div>

        <div class="footer-note">${escapeHtml(p.name)} · ${escapeHtml(p.brand || 'Veena Dev')}</div>
      </div>
    </div>
  `;
}

function sanitizeHeadline(html) {
  if (!html) return '';
  return String(html).replace(/<(?!\/?span\b)[^>]+>/gi, '');
}
