function renderProposal(data) {
  const p = data.profile || DEFAULT_PROFILE;
  const tags = (data.tags || []).map(t => `<span class="cover-tag">${escapeHtml(t)}</span>`).join('');
  const reqs = (data.requirements || []).map((r, i) => serviceRow(i + 1, r.requirement, r.response)).join('');
  const phases = (data.phases || []).map((ph, i) => stepRow(i + 1, ph.title, ph.description)).join('');
  const deliverables = (data.deliverables || []).map(d => `<li>${escapeHtml(d)}</li>`).join('');
  const whyMe = (data.whyMePoints || []).map(w => `<li>${escapeHtml(w)}</li>`).join('');
  const timelineRows = (data.timeline || []).map(t => `
    <tr>
      <td><strong>${escapeHtml(t.phase)}</strong></td>
      <td>${escapeHtml(t.duration)}</td>
      <td>${escapeHtml(t.output)}</td>
    </tr>
  `).join('');
  const techCards = (data.techStack || []).slice(0, 6).map((t, i) => `
    <div class="card ${i % 2 ? 'card-green' : 'card-blue'}">
      <div class="card-icon">${i % 2 ? '⚙️' : '💻'}</div>
      <h3>${escapeHtml(t)}</h3>
      <p>Production-tested in client projects and open-source repos.</p>
    </div>
  `).join('');
  const demoBlock = renderDemoPlan(data.demoPlan);

  return `
    <div class="proposal-doc">
      <!-- PAGE 1: COVER -->
      <div class="page cover">
        <div class="cover-top">
          <div class="cover-badge">${escapeHtml(p.badge)}</div>
          <div class="cover-year">${escapeHtml(p.year)}</div>
        </div>
        <div class="cover-main">
          <h1>${sanitizeHeadline(data.coverHeadline) || `Your <span>Project</span> — Built Right`}</h1>
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

      <!-- PAGE 2: REQUIREMENTS -->
      <div class="page inner">
        <div class="page-header">
          <div class="page-logo">${escapeHtml(p.brand.split(' ')[0])} <span>${escapeHtml(p.brand.split(' ')[1] || 'Dev')}</span></div>
          <div class="page-num">02</div>
        </div>
        <span class="section-label">Your Requirements</span>
        <h2>Understanding What You Need</h2>
        <p class="lead">${escapeHtml(data.understandingLead)}</p>
        <div class="highlight-box">
          <p><strong>Project:</strong> ${escapeHtml(data.projectTitle)}</p>
        </div>
        ${reqs}
        <div class="footer-note">${escapeHtml(p.name)} · Independent Development · Confidential Proposal</div>
      </div>

      <!-- PAGE 3: STRATEGY -->
      <div class="page inner">
        <div class="page-header">
          <div class="page-logo">${escapeHtml(p.brand.split(' ')[0])} <span>${escapeHtml(p.brand.split(' ')[1] || 'Dev')}</span></div>
          <div class="page-num">03</div>
        </div>
        <span class="section-label">Technical Strategy</span>
        <h2>How I Would Build This</h2>
        <p class="lead">${escapeHtml(data.strategyOverview)}</p>
        <div class="steps">${phases}</div>
        <span class="section-label">Tech Stack</span>
        <div class="grid-3">${techCards}</div>
        ${demoBlock}
        <div class="footer-note">${escapeHtml(p.name)} · Independent Development · Confidential Proposal</div>
      </div>

      <!-- PAGE 4: DELIVERABLES & TIMELINE -->
      <div class="page inner">
        <div class="page-header">
          <div class="page-logo">${escapeHtml(p.brand.split(' ')[0])} <span>${escapeHtml(p.brand.split(' ')[1] || 'Dev')}</span></div>
          <div class="page-num">04</div>
        </div>
        <span class="section-label">Deliverables</span>
        <h2>What You Will Receive</h2>
        <ul class="req-list">${deliverables}</ul>
        <span class="section-label">Timeline</span>
        <h2>Milestone Plan</h2>
        <table>
          <thead>
            <tr><th>Phase</th><th>Duration</th><th>Output</th></tr>
          </thead>
          <tbody>${timelineRows}</tbody>
        </table>
        <span class="section-label">Why Me</span>
        <div class="highlight-box">
          <ul class="req-list" style="margin:0">${whyMe}</ul>
        </div>
        <div class="footer-note">${escapeHtml(p.name)} · Independent Development · Confidential Proposal</div>
      </div>

      <!-- PAGE 5: CTA -->
      <div class="page cta-page">
        <div class="cta-box">
          <span class="section-label">Next Step</span>
          <h2>Let's Build Something Solid</h2>
          <p>${escapeHtml(data.closingNote || 'Message me on Upwork to discuss scope — I respond within 24 hours with honest feedback and a clear plan.')}</p>
          <div class="cta-btn">Message on Upwork →</div>
          <div class="contact-row">
            <div><strong>${escapeHtml(p.name)}</strong>Independent Developer</div>
            <div><strong>Upwork</strong>${escapeHtml(p.upwork)}</div>
            <div><strong>GitHub</strong>${escapeHtml(p.github)}</div>
          </div>
        </div>
        <p style="margin-top:40px;font-size:0.8rem;color:#94a3b8;max-width:400px;">
          Thank you for considering a small, accountable developer over a faceless agency. I don't have a sales team — just me, my code, and my word.
        </p>
        <div class="footer-note" style="position:relative;bottom:auto;margin-top:48px;">
          © ${escapeHtml(p.year)} ${escapeHtml(p.name)} · Confidential proposal for this project only.
        </div>
      </div>
    </div>
  `;
}

function serviceRow(num, title, desc) {
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

function stepRow(num, title, desc) {
  return `
    <div class="step">
      <div class="step-dot">${num}</div>
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
    <span class="section-label">Quick Demo</span>
    <div class="highlight-box demo-box">
      <p><strong>${escapeHtml(demo.title || 'Early proof-of-approach')}</strong></p>
      <p>${escapeHtml(demo.description || '')}</p>
      ${items ? `<ul class="req-list" style="margin:12px 0 0">${items}</ul>` : ''}
    </div>
  `;
}
