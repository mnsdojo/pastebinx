import { z } from "../lib/openapi";
/**
 * Register schema
 * Used for: POST /api/auth/register
 */
export const registerSchema = z
  .object({
    body: z.object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters")
        .regex(
          /^[a-zA-Z0-9_]+$/,
          "Username can only contain letters, numbers, and _"
        ),

      email: z
        .email("Invalid email address")
        .min(5, "Email is too short")
        .max(254, "Email is too long"),

      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password is too long"),
    }),
  })
  .openapi("RegisterRequest");

/**
 * Login schema
 * Used for: POST /api/auth/login
 */
export const loginSchema = z
  .object({
    body: z.object({
      email: z
        .email("Invalid email address")
        .min(5, "Email is too short")
        .max(254, "Email is too long"),
      password: z.string().min(1, "Password is required"),
    }),
  })
  .openapi("LoginRequest");
