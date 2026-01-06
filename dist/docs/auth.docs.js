"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("./registry");
const auth_schema_1 = require("../schemas/auth.schema");
registry_1.registry.registerPath({
    method: "post",
    path: "/api/auth/register",
    summary: "Register a new user",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": { schema: auth_schema_1.registerSchema },
            },
        },
    },
    responses: {
        201: { description: "User registered successfully" },
        400: { description: "Validation error" },
    },
});
registry_1.registry.registerPath({
    method: "post",
    path: "/api/auth/login",
    summary: "Login user",
    tags: ["Auth"],
    request: {
        body: {
            content: {
                "application/json": { schema: auth_schema_1.loginSchema },
            },
        },
    },
    responses: {
        200: { description: "Login successful" },
        401: { description: "Invalid credentials" },
    },
});
registry_1.registry.registerPath({
    method: "get",
    path: "/api/auth/me",
    summary: "Get current user profile",
    tags: ["Auth"],
    security: [{ bearerAuth: [] }],
    responses: {
        200: { description: "User profile" },
        401: { description: "Unauthorized" },
    },
});
