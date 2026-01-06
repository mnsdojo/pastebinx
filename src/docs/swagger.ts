import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import "./auth.docs";
import { registry } from "./registry";

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const document = generator.generateDocument({
    openapi: "3.0.0",
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
