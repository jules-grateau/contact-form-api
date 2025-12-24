import dotenv from "dotenv";
dotenv.config();

import express from "express";
import contactRoutes from "./routes/contact";
import { configManager } from "./utils/config";
import { errorMessages, successMessages } from "./i18n/fr";

const app = express();
const apiConfig = configManager.getApiConfig();

// Middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

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

