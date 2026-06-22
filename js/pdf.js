async function downloadPDF(element, filename) {
  if (typeof html2pdf === 'undefined') {
    throw new Error('PDF library not loaded');
  }

  const opt = {
    margin: 0,
    filename: filename || 'Proposal.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      scrollY: 0,
      windowWidth: element.scrollWidth
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'], before: '.page' }
  };

  await html2pdf().set(opt).from(element).save();
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'proposal';
}
