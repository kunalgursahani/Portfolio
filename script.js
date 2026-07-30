// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll-reveal for sections
const revealTargets = document.querySelectorAll(
  '.about, .section-head, .skills-grid, .connect-grid, .blog-feed'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => io.observe(el));

// Orbit diagram hover / focus captions
const nodeInfo = {
  rap:     { label: 'RAP',            text: 'RESTful ABAP Programming Model — CDS + behavior definitions for S/4HANA business objects.' },
  fiori:   { label: 'Fiori',          text: 'Role-based SAPUI5 experiences, consistent across desktop and mobile.' },
  fioriel: { label: 'Fiori Elements', text: 'Metadata-driven List Report, Object Page and Overview Page apps.' },
  n8n:     { label: 'n8n',            text: 'Workflow automation connecting SAP to everything outside it.' },
  joule:   { label: 'Joule',          text: "SAP's generative AI copilot, embedded across daily workflows." },
  abap:    { label: 'ABAP',           text: 'The backbone language — still powering custom logic across SAP.' },
};

const captionLabel = document.querySelector('.orbit-caption-label');
const captionText  = document.querySelector('.orbit-caption-text');
const nodes = document.querySelectorAll('.node');
const connectors = document.querySelectorAll('.connector');

function activate(key){
  const info = nodeInfo[key];
  if (!info) return;
  captionLabel.textContent = info.label;
  captionText.textContent = info.text;
  connectors.forEach(c => {
    c.style.stroke = c.dataset.node === key ? 'var(--ext-blue)' : '';
    c.style.strokeWidth = c.dataset.node === key ? '2' : '';
  });
}

function reset(){
  captionLabel.textContent = 'Hover a node';
  captionText.textContent = 'Explore how each piece extends the core.';
  connectors.forEach(c => {
    c.style.stroke = '';
    c.style.strokeWidth = '';
  });
}

nodes.forEach(node => {
  const key = node.dataset.node;
  node.addEventListener('mouseenter', () => activate(key));
  node.addEventListener('focus', () => activate(key));
  node.addEventListener('mouseleave', reset);
  node.addEventListener('blur', reset);
});

// Nav background intensifies on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.style.background = 'rgba(10,13,18,0.85)';
  } else {
    nav.style.background = '';
  }
});
