import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_EMAIL } from './supabase-config.js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const authStatus = document.getElementById('authStatus');
const signInBox = document.getElementById('signInBox');
const composer = document.getElementById('composer');
const postsList = document.getElementById('postsList');
const postsListInner = document.getElementById('postsListInner');
const signOutBtn = document.getElementById('signOutBtn');

document.getElementById('signInBtn').addEventListener('click', async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.href }
  });
  if (error) authStatus.textContent = "Sign-in failed: " + error.message;
});

signOutBtn.addEventListener('click', async () => {
  await supabase.auth.signOut();
  updateUI(null);
});

function updateUI(user){
  if (!user){
    authStatus.textContent = "Not signed in.";
    signInBox.style.display = 'block';
    composer.style.display = 'none';
    postsList.style.display = 'none';
    signOutBtn.style.display = 'none';
    return;
  }

  if (user.email !== ADMIN_EMAIL){
    authStatus.textContent = `Signed in as ${user.email}, but this account isn't allowed to publish here.`;
    signInBox.style.display = 'none';
    composer.style.display = 'none';
    postsList.style.display = 'none';
    signOutBtn.style.display = 'inline-flex';
    return;
  }

  authStatus.textContent = `Signed in as ${user.email}`;
  signInBox.style.display = 'none';
  composer.style.display = 'block';
  postsList.style.display = 'block';
  signOutBtn.style.display = 'inline-flex';
  loadPostsList();
}

supabase.auth.getSession().then(({ data }) => {
  updateUI(data.session ? data.session.user : null);
});

supabase.auth.onAuthStateChange((_event, session) => {
  updateUI(session ? session.user : null);
});

document.getElementById('publishBtn').addEventListener('click', async () => {
  const title = document.getElementById('postTitle').value.trim();
  const tag = document.getElementById('postTag').value.trim();
  const url = document.getElementById('postUrl').value.trim();
  const excerpt = document.getElementById('postExcerpt').value.trim();
  const msg = document.getElementById('publishMsg');

  if (!title){
    msg.textContent = "Title is required.";
    return;
  }

  const { error } = await supabase.from('posts').insert({ title, tag, url, excerpt });

  if (error){
    msg.textContent = "Error: " + error.message;
    return;
  }

  document.getElementById('postTitle').value = '';
  document.getElementById('postTag').value = '';
  document.getElementById('postUrl').value = '';
  document.getElementById('postExcerpt').value = '';
  msg.textContent = "Published.";
  setTimeout(() => { msg.textContent = ''; }, 2000);
  loadPostsList();
});

async function loadPostsList(){
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error){
    postsListInner.innerHTML = `<p style="color:var(--text-faint);">Couldn't load posts: ${error.message}</p>`;
    return;
  }

  postsListInner.innerHTML = data.map(p => `
    <div class="admin-post-row">
      <span>${(p.title || '(untitled)').replace(/</g, '&lt;')}</span>
      <button class="btn-danger" data-id="${p.id}">Delete</button>
    </div>
  `).join('') || '<p style="color:var(--text-faint);">No posts yet.</p>';

  postsListInner.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', async () => {
      await supabase.from('posts').delete().eq('id', btn.dataset.id);
      loadPostsList();
    });
  });
}
