# Kunal Gursahani — Portfolio

Static site (index.html + admin.html) with a live blog powered by
**Supabase** — Postgres database + Google sign-in. Free tier, no credit
card required for any of this.

## 1. Edit your social links
Open `index.html`, find the `<!-- >>> EDIT ME -->` comment inside the
`#connect` section, and replace each `href="#"` with your real profile URL.

## 2. Set up Supabase (one-time, ~10 minutes)

1. Go to https://supabase.com → **Start your project** → sign up (GitHub
   login is fastest) → **New project** → give it a name, a database
   password (save it somewhere), pick a region → **Create**.

2. Once it's ready, go to the **SQL Editor** (left sidebar) → **New
   query** → paste this and click **Run**:

   ```sql
   create table posts (
     id uuid default gen_random_uuid() primary key,
     title text not null,
     tag text,
     url text,
     excerpt text,
     created_at timestamptz default now()
   );

   alter table posts enable row level security;

   create policy "Public can read posts"
   on posts for select
   using (true);

   create policy "Only admin can insert"
   on posts for insert
   to authenticated
   with check (auth.jwt() ->> 'email' = 'your-email@gmail.com');

   create policy "Only admin can delete"
   on posts for delete
   to authenticated
   using (auth.jwt() ->> 'email' = 'your-email@gmail.com');
   ```

   Replace `your-email@gmail.com` in **both** policies with the Google
   account you'll log in with.

3. (Optional, for live updates without refresh) Table Editor → click the
   `posts` table → toggle **Enable Realtime**.

4. **Enable Google sign-in:**
   - In Supabase: **Authentication** → **Providers** → **Google** → toggle
     it on. It will show you a **Callback URL** — copy it, you need it next.
   - In a new tab, go to https://console.cloud.google.com → create a
     project (or use an existing one) → **APIs & Services** →
     **Credentials** → **Create Credentials** → **OAuth client ID**.
   - Application type: **Web application**. Under **Authorized redirect
     URIs**, paste the Callback URL from Supabase.
   - Copy the **Client ID** and **Client Secret** it generates, paste them
     into the Supabase Google provider screen, and **Save**.

5. **Authentication** → **URL Configuration** → set **Site URL** to your
   site's URL (use `http://localhost:3000` for now if you haven't deployed
   yet — update it once you're on Vercel). Add both your local and Vercel
   URLs under **Redirect URLs** too.

6. **Project Settings** → **API** → copy the **Project URL** and the
   **anon public** key.

7. Open `supabase-config.js` in this folder and paste those two values in,
   plus set `ADMIN_EMAIL` to the same email used in step 2's policies.

## 3. Deploy to Vercel

1. Push this folder to a GitHub repo (or drag-and-drop it in the Vercel
   dashboard).
2. In Vercel: **New Project** → Import → select the repo/folder.
3. Framework preset: **Other** (plain HTML/CSS/JS, no build command needed).
4. Deploy.
5. Go back to Supabase → **Authentication** → **URL Configuration** →
   update **Site URL** and **Redirect URLs** to your real Vercel URL
   (e.g. `https://your-project.vercel.app`), otherwise Google sign-in
   will redirect to the wrong place.

## 4. Write posts

Visit `your-site.com/admin.html`, click **Sign in with Google**, use the
account matching `ADMIN_EMAIL`. Fill in the form and hit **Publish** — it
appears on the homepage's "Field Notes" section (instantly if you enabled
Realtime in step 3, otherwise on next page load). Delete old posts from
the same page.

Anyone else who signs in just sees a "not allowed to publish" message —
the database itself blocks their writes via the RLS policies, not just
the UI.
