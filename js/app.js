let currentProposal = null;
let settings = loadSettings();

const els = {
  jobPost: document.getElementById('jobPost'),
  profileName: document.getElementById('profileName'),
  profileBrand: document.getElementById('profileBrand'),
  profileTitle: document.getElementById('profileTitle'),
  profileUpwork: document.getElementById('profileUpwork'),
  profileGithub: document.getElementById('profileGithub'),
  apiKey: document.getElementById('apiKey'),
  model: document.getElementById('model'),
  promptSystem: document.getElementById('promptSystem'),
  promptUser: document.getElementById('promptUser'),
  btnGenerate: document.getElementById('btnGenerate'),
  btnDownload: document.getElementById('btnDownload'),
  btnSaveSettings: document.getElementById('btnSaveSettings'),
  btnSavePrompts: document.getElementById('btnSavePrompts'),
  previewFrame: document.getElementById('previewFrame'),
  previewEmpty: document.getElementById('previewEmpty'),
  status: document.getElementById('status'),
  statusText: document.getElementById('statusText'),
  modeTemplate: document.getElementById('modeTemplate'),
  modeAI: document.getElementById('modeAI')
};

function init() {
  populateForm();
  bindEvents();
  updateModeUI();
  window.addEventListener('resize', updatePreviewScale);
}

function populateForm() {
  els.profileName.value = settings.profile.name;
  els.profileBrand.value = settings.profile.brand;
  els.profileTitle.value = settings.profile.title;
  els.profileUpwork.value = settings.profile.upwork;
  els.profileGithub.value = settings.profile.github;
  els.apiKey.value = settings.apiKey;
  els.model.value = settings.model;
  els.promptSystem.value = settings.prompts.system;
  els.promptUser.value = settings.prompts.user;
}

function bindEvents() {
  els.btnGenerate.addEventListener('click', handleGenerate);
  els.btnDownload.addEventListener('click', handleDownload);
  els.btnSaveSettings.addEventListener('click', handleSaveSettings);
  if (els.btnSavePrompts) els.btnSavePrompts.addEventListener('click', handleSaveSettings);
  els.modeTemplate.addEventListener('click', () => setMode('template'));
  els.modeAI.addEventListener('click', () => setMode('ai'));
}

function setMode(mode) {
  settings.mode = mode;
  storageSet(STORAGE_KEYS.mode, mode);
  updateModeUI();
}

function updateModeUI() {
  els.modeTemplate.classList.toggle('active', settings.mode === 'template');
  els.modeAI.classList.toggle('active', settings.mode === 'ai');
  els.statusText.textContent = settings.mode === 'ai'
    ? (settings.apiKey ? 'AI Enhanced — key configured' : 'AI Enhanced — add API key in settings')
    : 'Smart Draft — instant, no API needed';
}

function readSettingsFromForm() {
  settings.profile = {
    ...settings.profile,
    name: els.profileName.value.trim() || DEFAULT_PROFILE.name,
    brand: els.profileBrand.value.trim() || DEFAULT_PROFILE.brand,
    title: els.profileTitle.value.trim() || DEFAULT_PROFILE.title,
    upwork: els.profileUpwork.value.trim() || DEFAULT_PROFILE.upwork,
    github: els.profileGithub.value.trim() || DEFAULT_PROFILE.github
  };
  settings.apiKey = els.apiKey.value.trim();
  settings.model = els.model.value;
  settings.prompts = {
    system: els.promptSystem.value,
    user: els.promptUser.value
  };
  saveSettings(settings);
  updateModeUI();
}

function handleSaveSettings() {
  readSettingsFromForm();
  setStatus('ready', 'Settings saved');
}

async function handleGenerate() {
  const jobPost = els.jobPost.value.trim();
  if (!jobPost) {
    alert('Paste a job post first.');
    return;
  }

  readSettingsFromForm();
  setStatus('loading', 'Generating proposal…');
  els.btnGenerate.disabled = true;

  try {
    let proposal;
    if (settings.mode === 'ai') {
      proposal = await generateWithAI(cleaned, settings);
    } else {
      const parsed = parseJobPost(cleaned);
      proposal = generateFromTemplate(parsed, settings.profile);
    }

    currentProposal = proposal;
    showPreview(proposal);
    els.btnDownload.disabled = false;
    setStatus('ready', `Proposal ready — ${proposal.projectTitle}`);
  } catch (err) {
    console.error(err);
    setStatus('ready', 'Generation failed');
    alert(err.message || 'Failed to generate proposal');
  } finally {
    els.btnGenerate.disabled = false;
  }
}

function updatePreviewScale() {
  if (!currentProposal || els.previewFrame.classList.contains('hidden')) return;

  const width = els.previewFrame.parentElement?.clientWidth || 0;
  const scale = Math.max(0.25, Math.min(1, (width - 64) / 794));
  els.previewFrame.style.transform = `scale(${scale})`;
  els.previewFrame.style.marginBottom = `${-(297 * 2 * (1 - scale))}mm`;
}

function showPreview(proposal) {
  const html = renderProposal(proposal);
  els.previewFrame.innerHTML = html;
  els.previewFrame.classList.remove('hidden');
  els.previewEmpty.classList.add('hidden');
  updatePreviewScale();
  els.previewFrame.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function handleDownload() {
  if (!currentProposal) return;

  const doc = els.previewFrame.querySelector('.proposal-doc');
  if (!doc) return;

  setStatus('loading', 'Creating PDF…');
  els.btnDownload.disabled = true;

  try {
    const name = slugify(currentProposal.projectTitle);
    await downloadPDF(doc, `${name}-Proposal.pdf`);
    setStatus('ready', 'PDF downloaded');
  } catch (err) {
    console.error(err);
    alert('PDF export failed. Try Chrome browser or use Print → Save as PDF.');
  } finally {
    els.btnDownload.disabled = false;
  }
}

function setStatus(state, text) {
  els.status.className = `status ${state}`;
  els.statusText.textContent = text;
}

document.addEventListener('DOMContentLoaded', init);
