import dotenv from "dotenv";
dotenv.config();

import express from "express";
import contactRoutes from "./routes/contact";
import { configManager } from "./utils/config";
const app = express();
const apiConfig = configManager.getApiConfig();

// Middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API opérationnelle",
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use(apiConfig.prefix, contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Point de terminaison introuvable",
    error: `${req.method} ${req.path} introuvable`,
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
      message: "Erreur interne du serveur",
      error: err.message || "Erreur inconnue",
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
