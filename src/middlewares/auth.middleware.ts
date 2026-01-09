import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../lib/jwt";

export interface AuthRequest extends Request {
  user?: { id: string };
}

/**
 * 🔐 Middleware: Requires authentication
 * - Used on protected routes like /me
 */
export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Must be "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const payload = await verifyJwt(token);

    // ✅ Support both JWT styles
    const userId = payload.sub || payload.userId;

    if (!userId || typeof userId !== "string") {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { id: userId };
    next();
  } catch (error) {
    console.error("❌ requireAuth error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

/**
 * 🔓 Middleware: Optional authentication
 * - Used when login is optional
 */
export async function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      req.user = undefined;
      return next();
    }

    const decoded = await verifyJwt(token);

    // ✅ Normalize user id
    const userId = decoded.sub || decoded.userId;

    if (userId && typeof userId === "string") {
      req.user = { id: userId };
    } else {
      req.user = undefined;
    }
  } catch (error) {
    console.warn("⚠️ optionalAuth invalid token");
    req.user = undefined;
  }

  next();
}
