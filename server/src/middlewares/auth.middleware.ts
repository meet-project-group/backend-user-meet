// src/middlewares/auth.middleware.ts
import { auth } from "../config/firebase";
import { Request, Response, NextFunction } from "express";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = header.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = await auth.verifyIdToken(token);

    req.body.authUid = decoded.uid;

    next();
  } catch (err: any) {
    return res.status(401).json({ message: "Invalid token", error: err.message });
  }
}
