import fs from "fs";
import path from "path";

interface AppSettings {
  app: {
    name: string;
    version: string;
  };
  email: {
    fromEmail: string;
    toEmail: string;
    fromName: string;
  };
  api: {
    port: number;
    prefix: string;
  };
  validation: {
    minMessageLength: number;
    maxMessageLength: number;
  };
}

class ConfigManager {
  private settings: AppSettings;

  constructor() {
    // The config directory is located at the project root: /config/settings.json
    const configPath = path.join(__dirname, "../../config/settings.json");

    if (!fs.existsSync(configPath)) {
      throw new Error(
        `Configuration file not found at ${configPath}. Please ensure config/settings.json exists.`
      );
    }

    const rawData = fs.readFileSync(configPath, "utf-8");
    this.settings = JSON.parse(rawData);

    // The sender email must be provided via the FROM_EMAIL environment variable only
    const fromEmail = process.env.FROM_EMAIL;
    if (!fromEmail) {
      throw new Error("FROM_EMAIL environment variable must be set");
    }

    if (!this.settings.email) {
      this.settings.email = {
        fromEmail,
        toEmail: "",
        fromName: "",
      } as any;
    } else {
      this.settings.email.fromEmail = fromEmail;
    }
  }

  getSettings(): AppSettings {
    return this.settings;
  }

  getEmailConfig() {
    return this.settings.email;
  }

  getApiConfig() {
    return this.settings.api;
  }

  getValidationRules() {
    return this.settings.validation;
  }
}

export const configManager = new ConfigManager();
