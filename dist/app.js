"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const swagger_1 = require("./docs/swagger");
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: {
        policy: "cross-origin",
    },
}));
const allowedOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not Allowed By Cors"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json({ limit: "1mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "1mb" }));
if (process.env.NODE_ENV !== "production") {
    app.use((0, morgan_1.default)("dev"));
}
if (process.env.NODE_ENV !== "production") {
    const openApiDoc = (0, swagger_1.generateOpenAPIDocument)();
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openApiDoc));
}
app.get("/health", (_, res) => {
    res.json({ status: "OK" });
});
app.use("/api/auth", auth_route_1.default);
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({
        message: "Internal Server error",
    });
});
exports.default = app;
