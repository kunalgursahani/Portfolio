# Kunal Gursahani — Portfolio

Static site (index.html + admin.html) with a live blog powered by
**Firebase** — Google sign-in for you, Firestore as the database.
No backend server to run; Firebase handles all of it, free tier is plenty
for a personal blog.

## 1. Edit your social links
Open `index.html`, find the `<!-- >>> EDIT ME -->` comment inside the
`#connect` section, and replace each `href="#"` with your real profile URL.

## 2. Set up Firebase (one-time, ~10 minutes)

1. Go to https://console.firebase.google.com → **Add project** → give it
   any name → finish the wizard.
2. **Authentication** → *Get started* → *Sign-in method* → enable **Google**.
3. **Firestore Database** → *Create database* → start in **production
   mode** → pick a region close to you.
4. Firestore → **Rules** tab → replace the contents with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /posts/{postId} {
         allow read: if true;
         allow write: if request.auth != null
                      && request.auth.token.email == "your-email@gmail.com";
       }
     }
   }
   ```

   Replace `your-email@gmail.com` with the Google account you'll log in
   with, then click **Publish**.

5. Project settings (gear icon, top left) → scroll to **Your apps** →
   click the **</>** (web) icon → register an app (no need for Firebase
   Hosting) → copy the `firebaseConfig` object it gives you.
6. Open `firebase-config.js` in this folder and paste that config in.
   Also set `ADMIN_EMAIL` to the **same** email you used in step 4 —
   this is what lets `admin.html` recognize you as the owner.

## 3. Deploy to Vercel

1. Push this folder to a GitHub repo (or drag-and-drop it in the Vercel
   dashboard).
2. In Vercel: **New Project** → Import → select the repo/folder.
3. Framework preset: **Other** (plain HTML/CSS/JS, no build command needed).
4. Deploy.
5. Back in Firebase: **Authentication** → **Settings** → **Authorized
   domains** → **Add domain** → add your Vercel URL
   (e.g. `your-project.vercel.app`), otherwise Google sign-in will be
   blocked on the live site.

## 4. Write posts

Visit `your-site.com/admin.html`, click **Sign in with Google**, use the
account matching `ADMIN_EMAIL`. Fill in the form and hit **Publish** — it
shows up on the homepage's "Field Notes" section instantly, live for
every visitor, no redeploy needed. Delete old posts from the same page.

Anyone else who signs in just sees a "not allowed to publish" message —
they can't write or delete anything.
