// Import the Firebase Admin SDK.
// Required for server-side authentication and Firestore access.
import admin from "firebase-admin";

// Initialize Firebase Admin only if no existing instance is active.
// This prevents errors when using Hot Reload or serverless environments.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      // Project ID associated with the Firebase service account.
      projectId: process.env.FIREBASE_PROJECT_ID,

      // Private key for Firebase service account.
      // The replace() call fixes newline formatting issues in environment variables.
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),

      // Client email of the service account.
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

// Export the Firebase Authentication service.
// Used for verifying tokens, managing users, and protected backend routes.
export const auth = admin.auth();

// Export Firestore database instance for server-side operations.
export const db = admin.firestore();
