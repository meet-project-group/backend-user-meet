// src/middlewares/auth.middleware.ts

// Import Firebase Admin authentication instance.
import { auth } from "../config/firebase";
// Import Express types for typing middleware parameters.
import { Request, Response, NextFunction } from "express";


// ======================================
// 🔐 Authentication Middleware
// Validates Firebase ID Token sent in Authorization header.
// ======================================
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Read the Authorization header (expected format: "Bearer <token>").
    const header = req.headers.authorization;

    // If the header is missing, return 401 Unauthorized.
    if (!header) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Extract the token (part after "Bearer").
    const token = header.split(" ")[1];

    // If token is missing, return 401 Unauthorized.
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    // Verify the Firebase ID token and decode its payload.
    const decoded = await auth.verifyIdToken(token);

    // Save the authenticated user's UID inside request body for later handlers.
    req.body.authUid = decoded.uid;

    // Token is valid → continue to the next middleware or controller.
    next();

  } catch (err: any) {
    // If token verification fails, return 401 Unauthorized with error info.
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
}
