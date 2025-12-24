import fs from "fs";
import path from "path";
import { errorMessages } from "../i18n/fr";

interface ClientConfig {
  toEmail: string;
  fromName: string;
  maxMessageSize?: number;
  hourlyRateLimit?: number;
}

interface AppSettings {
  app: {
    name: string;
    version: string;
  };
  api: {
    port: number;
    prefix: string;
  };
}

class ConfigManager {
  private settings: AppSettings;
  private fromEmail: string;
  private clients: Map<string, ClientConfig>;

  constructor() {
    // The config directory is located at the project root: /config/settings.json
    const configPath = path.join(__dirname, "../../config/settings.json");

    if (!fs.existsSync(configPath)) {
      throw new Error(errorMessages.configNotFound(configPath));
    }

    const rawData = fs.readFileSync(configPath, "utf-8");
    this.settings = JSON.parse(rawData);

    // The sender email must be provided via the FROM_EMAIL environment variable only
    const fromEmail = process.env.FROM_EMAIL;
    if (!fromEmail) {
      throw new Error(errorMessages.fromEmailMissing);
    }

    this.fromEmail = fromEmail;

    // Load client configurations from CLIENTS_CONFIG environment variable
    this.clients = this.loadClientsFromEnv();
  }

  private loadClientsFromEnv(): Map<string, ClientConfig> {
    const clientsJson = process.env.CLIENTS_CONFIG;
    if (!clientsJson) {
      throw new Error(errorMessages.clientsConfigMissing);
    }

    try {
      const clientsObj = JSON.parse(clientsJson);
      return new Map(Object.entries(clientsObj));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : errorMessages.unknownError;
      throw new Error(errorMessages.clientsConfigInvalid(errorMessage));
    }
  }

  getSettings(): AppSettings {
    return this.settings;
  }

  getFromEmail(): string {
    return this.fromEmail;
  }

  getClientConfig(clientId: string): ClientConfig {
    const clientConfig = this.clients.get(clientId);
    if (!clientConfig) {
      throw new Error(errorMessages.clientConfigNotFound(clientId));
    }
    return clientConfig;
  }

  getApiConfig() {
    return this.settings.api;
  }
}

export const configManager = new ConfigManager();
