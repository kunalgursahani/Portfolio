// >>> EDIT ME (step 1 of 2)
// Supabase Dashboard → your project → Project Settings → API →
// copy "Project URL" and "anon public" key here.
// The anon key is safe to expose in client code — real protection comes
// from the Row Level Security policies you set up in Supabase (see README.md).
export const SUPABASE_URL = "https://supabase.com/dashboard/project/ubfcgtsqwkzoaibaxvjl";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViZmNndHNxd2t6b2FpYmF4dmpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzNjM4NzcsImV4cCI6MjEwMDkzOTg3N30.8d-ri2y4UA-b8buZPNVvcNXxcnf3Q80LCer7kq3P7Ew";

// >>> EDIT ME (step 2 of 2)
// This is only used to show/hide the composer UI on admin.html. The real
// enforcement (who can actually insert/delete) lives in your Postgres RLS
// policies — this must match the email in that policy's WITH CHECK clause.
export const ADMIN_EMAIL = "KUNALGURSAHANI@GMAIL.COM";
