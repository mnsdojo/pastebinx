import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import "./auth.docs";
import { registry } from "./registry";

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://yourdomain.com" // change later when deployed
      : "http://localhost:4000";

  const document = generator.generateDocument({
    openapi: "3.0.0",

    servers: [
      {
        url: baseUrl,
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Local development server",
      },
    ],
    info: {
      title: "PastebinX API",
      version: "1.0.0",
      description: "Pastebin clone API",
    },
  });
  document.components = {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  };

  return document;
}
