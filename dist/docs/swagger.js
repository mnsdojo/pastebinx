"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOpenAPIDocument = generateOpenAPIDocument;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
require("./auth.docs");
const registry_1 = require("./registry");
function generateOpenAPIDocument() {
    const generator = new zod_to_openapi_1.OpenApiGeneratorV3(registry_1.registry.definitions);
    const document = generator.generateDocument({
        openapi: "3.0.0",
        info: {
            title: "PastebinX API",
            version: "1.0.0",
            description: "Production-grade Pastebin clone API",
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
