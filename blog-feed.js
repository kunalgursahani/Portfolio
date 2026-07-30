// Public reader — no login needed. Renders whatever is published in the
// "posts" table into the #blogFeed container on index.html.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const feed = document.getElementById('blogFeed');

function escapeHtml(str = ""){
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatDate(iso){
  if (!iso) return "";
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function render(posts){
  if (!feed) return;

  if (!posts || !posts.length){
    feed.innerHTML = '<p class="blog-empty">No posts yet — check back soon.</p>';
    return;
  }

  feed.innerHTML = posts.map(post => `
    <a class="blog-post" href="${post.url ? escapeHtml(post.url) : '#'}" target="_blank" rel="noopener">
      <span class="blog-post-date">${formatDate(post.created_at)}</span>
      <span class="blog-post-body">
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.excerpt)}</p>
        ${post.tag ? `<span class="blog-post-tag">${escapeHtml(post.tag)}</span>` : ''}
      </span>
      <span class="blog-post-arrow">→</span>
    </a>
  `).join('');
}

let supabase;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (err) {
  console.error('Supabase not configured yet:', err);
  if (feed) feed.innerHTML = '<p class="blog-empty">Blog isn\u2019t connected yet — see README.md.</p>';
}

async function loadPosts(){
  if (!supabase) return;
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error){
    console.error('Blog feed error:', error);
    if (feed) feed.innerHTML = '<p class="blog-empty">Couldn\u2019t load posts right now.</p>';
    return;
  }
  render(data);
}

loadPosts();

// Live updates: if you enable Realtime on the "posts" table (see README.md),
// new posts and deletes will appear here without a page refresh.
if (supabase){
  supabase
    .channel('posts-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, loadPosts)
    .subscribe();
}
