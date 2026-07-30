// >>> EDIT ME (step 1 of 2)
// Supabase Dashboard → your project → Project Settings → API →
// copy "Project URL" and "anon public" key here.
// The anon key is safe to expose in client code — real protection comes
// from the Row Level Security policies you set up in Supabase (see README.md).
export const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

// >>> EDIT ME (step 2 of 2)
// This is only used to show/hide the composer UI on admin.html. The real
// enforcement (who can actually insert/delete) lives in your Postgres RLS
// policies — this must match the email in that policy's WITH CHECK clause.
export const ADMIN_EMAIL = "your-email@gmail.com";
