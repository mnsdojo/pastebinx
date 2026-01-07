import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { ZodError } from "zod";

export const errorHandlerMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  // 1️⃣ AppError (your domain/business errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // 2️⃣ Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // 3️⃣ Prisma known errors (optional but good)
  if (err.code === "P2002") {
    return res.status(409).json({
      message: "Duplicate value for unique field",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      message: "Resource not found",
    });
  }

  // 4️⃣ Fallback — unknown errors
  return res.status(500).json({
    message: "Internal server error",
  });
};
