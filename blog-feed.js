// Public reader — no login needed. Renders whatever is published in
// Firestore's "posts" collection into the #blogFeed container on index.html.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, query, orderBy, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const feed = document.getElementById('blogFeed');

function escapeHtml(str = ""){
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatDate(ts){
  if (!ts || !ts.toDate) return "";
  return ts.toDate().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function render(posts){
  if (!feed) return;

  if (!posts.length){
    feed.innerHTML = '<p class="blog-empty">No posts yet — check back soon.</p>';
    return;
  }

  feed.innerHTML = posts.map(post => `
    <a class="blog-post" href="${post.url ? escapeHtml(post.url) : '#'}" target="_blank" rel="noopener">
      <span class="blog-post-date">${formatDate(post.createdAt)}</span>
      <span class="blog-post-body">
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.excerpt)}</p>
        ${post.tag ? `<span class="blog-post-tag">${escapeHtml(post.tag)}</span>` : ''}
      </span>
      <span class="blog-post-arrow">→</span>
    </a>
  `).join('');
}

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

  onSnapshot(q, (snap) => {
    render(snap.docs.map(d => d.data()));
  }, (err) => {
    console.error('Blog feed error:', err);
    if (feed) feed.innerHTML = '<p class="blog-empty">Couldn\u2019t load posts right now.</p>';
  });
} catch (err) {
  console.error('Firebase not configured yet:', err);
  if (feed) feed.innerHTML = '<p class="blog-empty">Blog isn\u2019t connected yet — see README.md.</p>';
}
