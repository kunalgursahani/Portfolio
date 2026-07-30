// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================================
// FIELD NOTES / BLOG
// ============================================================
// >>> EDIT ME: add a new object here to publish a new post.
// date   — shown as-is, e.g. "Aug 2026"
// title  — post title
// excerpt— one or two lines, keep it short
// tag    — small label, e.g. "RAP", "Fiori", "Clean Core"
// url    — link to the full post (Medium, LinkedIn article, your own blog, etc.)
const posts = [
  {
    date: "Aug 2026",
    title: "Joule Studio: AI-First Experience for Building",
    excerpt: "https://www.youtube.com/playlist?list=PL3ZRUb1AKkpQLtk3CqfoystL-CjHCg5tD",
    tag: "JOULE",
    url: "#"
  },
  {
    date: "Jul 2026",
    title: "Fiori Elements vs freestyle SAPUI5 — picking the right one",
    excerpt: "When metadata-driven floorplans save time, and when they don't.",
    tag: "Fiori",
    url: "#"
  },
  {
    date: "Jun 2026",
    title: "What 'Clean Core' actually means in a real project",
    excerpt: "Beyond the buzzword: how side-by-side extensibility changes upgrade planning.",
    tag: "Clean Core",
    url: "#"
  }
];

function renderPosts(){
  const feed = document.getElementById('blogFeed');
  if (!feed) return;

  if (!posts.length){
    feed.innerHTML = '<p class="blog-empty">No posts yet — check back soon.</p>';
    return;
  }

  feed.innerHTML = posts.map(post => `
    <a class="blog-post" href="${post.url}">
      <span class="blog-post-date">${post.date}</span>
      <span class="blog-post-body">
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <span class="blog-post-tag">${post.tag}</span>
      </span>
      <span class="blog-post-arrow">→</span>
    </a>
  `).join('');
}
renderPosts();

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
