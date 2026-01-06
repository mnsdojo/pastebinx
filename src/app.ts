import express from "express";
import swaggerUi from "swagger-ui-express";

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth.route";
import { generateOpenAPIDocument } from "./docs/swagger";
const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not Allowed By Cors"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV !== "production") {
  const openApiDoc = generateOpenAPIDocument();
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));
}
app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({
      message: "Internal Server error",
    });
  }
);

export default app;
