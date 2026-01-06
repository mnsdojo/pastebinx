import { registry } from "./registry";

import { registerSchema, loginSchema } from "../schemas/auth.schema";

registry.registerPath({
  method: "post",
  path: "/api/auth/register",
  summary: "Register a new user",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": { schema: registerSchema },
      },
    },
  },
  responses: {
    201: { description: "User registered successfully" },
    400: { description: "Validation error" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/login",
  summary: "Login user",
  tags: ["Auth"],
  request: {
    body: {
      content: {
        "application/json": { schema: loginSchema },
      },
    },
  },
  responses: {
    200: { description: "Login successful" },
    401: { description: "Invalid credentials" },
  },
});

registry.registerPath({
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
