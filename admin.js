import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, addDoc, deleteDoc, doc, query, orderBy, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, ADMIN_EMAIL } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const authStatus = document.getElementById('authStatus');
const signInBox = document.getElementById('signInBox');
const composer = document.getElementById('composer');
const postsList = document.getElementById('postsList');
const postsListInner = document.getElementById('postsListInner');
const signOutBtn = document.getElementById('signOutBtn');

document.getElementById('signInBtn').addEventListener('click', () => {
  signInWithPopup(auth, provider).catch(err => {
    authStatus.textContent = "Sign-in failed: " + err.message;
  });
});

signOutBtn.addEventListener('click', () => signOut(auth));

onAuthStateChanged(auth, (user) => {
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

  try{
    await addDoc(collection(db, 'posts'), {
      title, tag, url, excerpt,
      createdAt: serverTimestamp()
    });
    document.getElementById('postTitle').value = '';
    document.getElementById('postTag').value = '';
    document.getElementById('postUrl').value = '';
    document.getElementById('postExcerpt').value = '';
    msg.textContent = "Published.";
    setTimeout(() => { msg.textContent = ''; }, 2000);
  } catch(err){
    msg.textContent = "Error: " + err.message;
  }
});

const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
onSnapshot(q, (snap) => {
  postsListInner.innerHTML = snap.docs.map(d => {
    const p = d.data();
    return `
      <div class="admin-post-row">
        <span>${(p.title || '(untitled)').replace(/</g,'&lt;')}</span>
        <button class="btn-danger" data-id="${d.id}">Delete</button>
      </div>
    `;
  }).join('') || '<p style="color:var(--text-faint);">No posts yet.</p>';

  postsListInner.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', () => {
      deleteDoc(doc(db, 'posts', btn.dataset.id));
    });
  });
});
