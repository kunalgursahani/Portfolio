// >>> EDIT ME (step 1 of 2)
// Firebase Console → Project settings (gear icon) → General → "Your apps" →
// Web app → SDK setup and configuration → copy the config object here.
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// >>> EDIT ME (step 2 of 2)
// Only THIS Google account will be allowed to publish/delete posts from
// admin.html. Anyone else can sign in, but the composer stays locked for them.
// This must exactly match the email in your Firestore security rules too.
export const ADMIN_EMAIL = "your-email@gmail.com";
