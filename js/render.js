function renderProposal(data) {
  const p = data.profile || DEFAULT_PROFILE;
  const brandParts = (p.brand || 'Rajat Dev').split(' ');

  const tags = (data.tags || []).map(t => `<span class="cover-tag">${escapeHtml(t)}</span>`).join('');
  const reqs = (data.requirements || []).map((r, i) => reqBlock(r.requirement, r.response, i + 1)).join('');
  const phases = (data.phases || []).map((ph, i) => phaseRow(i + 1, ph.title, ph.description)).join('');
  const deliverables = (data.deliverables || []).map(d => `<li>${escapeHtml(d)}</li>`).join('');
  const timelineRows = (data.timeline || []).map(t => `
    <tr>
      <td><strong>${escapeHtml(t.phase)}</strong></td>
      <td>${escapeHtml(t.duration)}</td>
      <td>${escapeHtml(t.output)}</td>
    </tr>
  `).join('');
  const techPills = (data.techStack || []).map(t => `<span class="tech-pill">${escapeHtml(t)}</span>`).join('');
  const solution = data.solution || {};

  return `
    <div class="proposal-doc">
      <div class="page cover">
        <div class="cover-top">
          <div class="cover-badge">${escapeHtml(p.badge)}</div>
          <div class="cover-year">${escapeHtml(p.year)}</div>
        </div>
        <div class="cover-main">
          <h1>${sanitizeHeadline(data.coverHeadline) || 'Your <span>Project</span>'}</h1>
          <p class="cover-sub">${escapeHtml(data.coverSubtitle)}</p>
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
          <div class="page-logo">${escapeHtml(brandParts[0])} <span>${escapeHtml(brandParts[1] || 'Dev')}</span></div>
          <div class="page-num">02</div>
        </div>
        <span class="section-label">Understanding</span>
        <h2>What You Need</h2>
        <p class="lead">${escapeHtml(data.understandingLead)}</p>
        <div class="summary-box">
          <p><strong>Project scope:</strong> ${escapeHtml(data.projectTitle)}</p>
        </div>
        ${solution.summary ? `
        <div class="solution-box">
          <span class="section-label">Proposed Solution</span>
          <h3>${escapeHtml(solution.title || 'Recommended Approach')}</h3>
          <p>${escapeHtml(solution.summary)}</p>
        </div>` : ''}
        <span class="section-label">Requirements</span>
        <h2>How Each Point Is Addressed</h2>
        ${reqs}
        <div class="footer-note">${escapeHtml(p.name)} · Confidential Proposal</div>
      </div>

      <div class="page inner">
        <div class="page-header">
          <div class="page-logo">${escapeHtml(brandParts[0])} <span>${escapeHtml(brandParts[1] || 'Dev')}</span></div>
          <div class="page-num">03</div>
        </div>
        <span class="section-label">Strategy</span>
        <h2>Technical Approach</h2>
        <p class="lead">${escapeHtml(data.strategyOverview)}</p>
        <div class="phase-list">${phases}</div>
        <div class="spacer"></div>
        <span class="section-label">Stack</span>
        <div class="tech-row">${techPills}</div>
        <div class="footer-note">${escapeHtml(p.name)} · Confidential Proposal</div>
      </div>

      <div class="page inner">
        <div class="page-header">
          <div class="page-logo">${escapeHtml(brandParts[0])} <span>${escapeHtml(brandParts[1] || 'Dev')}</span></div>
          <div class="page-num">04</div>
        </div>
        <span class="section-label">Deliverables</span>
        <h2>What You Receive</h2>
        <ul class="clean-list">${deliverables}</ul>
        ${data.includeTimeline && timelineRows ? `
        <div class="spacer"></div>
        <span class="section-label">Timeline</span>
        <h2>Milestones</h2>
        <table>
          <thead>
            <tr><th>Phase</th><th>Duration</th><th>Output</th></tr>
          </thead>
          <tbody>${timelineRows}</tbody>
        </table>` : ''}
        <div class="footer-note">${escapeHtml(p.name)} · Confidential Proposal</div>
      </div>

      <div class="page cta-page">
        <div class="cta-box">
          <span class="section-label">Next Step</span>
          <h2>Let's Build Something Solid</h2>
          <p class="lead">${escapeHtml(data.closingNote || 'Message me on Upwork to discuss scope — I respond within 24 hours with honest feedback and a clear plan.')}</p>
          <div class="cta-btn" style="display:inline-block;background:#2563eb;color:#fff;padding:14px 32px;border-radius:10px;font-weight:700;font-size:0.95rem;margin-bottom:24px;">Message on Upwork</div>
          <div class="contact-grid">
            <div>
              <div class="label">Developer</div>
              <div class="value">${escapeHtml(p.name)}</div>
            </div>
            <div>
              <div class="label">Upwork</div>
              <div class="value">${escapeHtml(p.upwork)}</div>
            </div>
            <div>
              <div class="label">GitHub</div>
              <div class="value">${escapeHtml(p.github)}</div>
            </div>
            <div>
              <div class="label">Year</div>
              <div class="value">${escapeHtml(p.year)}</div>
            </div>
          </div>
        </div>
        <div class="footer-note" style="position:relative;bottom:auto;margin-top:56px;">
          © ${escapeHtml(p.year)} ${escapeHtml(p.name)} · Prepared exclusively for this engagement.
        </div>
      </div>
    </div>
  `;
}

function reqBlock(title, desc, num) {
  return `
    <div class="service-row">
      <div class="service-num">${String(num).padStart(2, '0')}</div>
      <div class="service-content">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(desc)}</p>
      </div>
    </div>
  `;
}

function phaseRow(num, title, desc) {
  return `
    <div class="phase-item">
      <div class="phase-num">${String(num).padStart(2, '0')}</div>
      <div>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(desc)}</p>
      </div>
    </div>
  `;
}

function sanitizeHeadline(html) {
  if (!html) return '';
  return String(html).replace(/<(?!\/?span\b)[^>]+>/gi, '');
}

function renderDemoPlan(demo) {
  if (!demo) return '';
  const items = (demo.items || []).map(i => `<li>${escapeHtml(i)}</li>`).join('');
  return `
    <span class="section-label">Early Demo</span>
    <div class="demo-block">
      <h3>${escapeHtml(demo.title || 'Proof of Approach')}</h3>
      <p>${escapeHtml(demo.description || '')}</p>
      ${items ? `<ul class="clean-list">${items}</ul>` : ''}
    </div>
  `;
}
