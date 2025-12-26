import dotenv from "dotenv";
dotenv.config();

import express from "express";
import contactRoutes from "./routes/contact";
import { configManager } from "./utils/config";
import { errorMessages, successMessages } from "./i18n/fr";
import cors from "cors";

const app = express();
const apiConfig = configManager.getApiConfig();

// Middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// Enable CORS only in non-production (development/test)
// Configure CORS: allow all in non-production, restrict in production to client origins
if ((process.env.NODE_ENV || "development") !== "production") {
  app.use(cors());
} else {
  const allowedOrigins = configManager.getAllowedOrigins();
  console.log("✓ CORS allowed origins:", allowedOrigins);

  const corsOptions = {
    origin: (origin: string | undefined, callback: any) => {
      if (!origin) {
        console.log("⚠ CORS request with no origin header (allowed)");
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) !== -1) {
        console.log(`✓ CORS request from ${origin} allowed`);
        return callback(null, true);
      }
      console.log(
        `✗ CORS request from ${origin} rejected. Allowed: ${allowedOrigins.join(
          ", "
        )}`
      );
      return callback(new Error("Not allowed by CORS"));
    },
  };

  app.use(cors(corsOptions));
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: successMessages.apiOperational,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use(apiConfig.prefix, contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: errorMessages.endpointNotFound,
    error: `${req.method} ${req.path} ${errorMessages.notFound}`,
  });
});

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      message: errorMessages.internalServerError,
      error: err.message || errorMessages.unknownError,
    });
  }
);

const PORT = process.env.PORT || apiConfig.port;

app.listen(PORT, () => {
  console.log(
    `✓ ${configManager.getSettings().app.name} running on port ${PORT}`
  );
  console.log(`✓ API prefix: ${apiConfig.prefix}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
});

