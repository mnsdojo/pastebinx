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

export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    req.user = undefined;
    return next();
  }
  try {
    const decoded = await verifyJwt(token);
    req.user = { id: decoded.userId };
  } catch {
    req.user = undefined;
  }
  next();
};
