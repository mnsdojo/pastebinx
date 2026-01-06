import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../lib/jwt";

export interface AuthRequest extends Request {
  user?: { id: string };
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyJwt(token);

    if (!payload.sub || typeof payload.sub !== "string") {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { id: payload.sub };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
