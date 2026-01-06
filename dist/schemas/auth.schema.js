"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const openapi_1 = require("../lib/openapi");
/**
 * Register schema
 * Used for: POST /api/auth/register
 */
exports.registerSchema = openapi_1.z
    .object({
    body: openapi_1.z.object({
        username: openapi_1.z
            .string()
            .min(3, "Username must be at least 3 characters")
            .max(30, "Username must be at most 30 characters")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and _"),
        email: openapi_1.z
            .email("Invalid email address")
            .min(5, "Email is too short")
            .max(254, "Email is too long"),
        password: openapi_1.z
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
exports.loginSchema = openapi_1.z
    .object({
    body: openapi_1.z.object({
        email: openapi_1.z
            .email("Invalid email address")
            .min(5, "Email is too short")
            .max(254, "Email is too long"),
        password: openapi_1.z.string().min(1, "Password is required"),
    }),
})
    .openapi("LoginRequest");
