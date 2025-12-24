import { Request, Response, NextFunction } from "express";
import { configManager } from "./config";
import { errorMessages } from "../i18n/fr";

interface RateLimitRecord {
  [ip: string]: number[];
}

const requests: RateLimitRecord = {};

const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const { clientId } = req.params;
  const clientConfig = configManager.getClientConfig(clientId);
  const { hourlyRateLimit } = clientConfig;

  if (!hourlyRateLimit) {
    return next();
  }

  // Get IP address from X-Forwarded-For header (for reverse proxies) or fallback to req.socket.remoteAddress
  const ip = (req.headers['x-forwarded-for'] as string || '').split(',')[0].trim() || req.socket.remoteAddress;

  if (!ip) {
    // Should not happen in a real scenario, but as a fallback
    return next();
  }

  const now = Date.now();
  const windowStart = now - 60 * 60 * 1000; // 1 hour ago

  const ipRequests = (requests[ip] || []).filter(
    (timestamp) => timestamp > windowStart
  );

  if (ipRequests.length >= hourlyRateLimit) {
    return res.status(429).json({
      success: false,
      message: errorMessages.tooManyRequests,
    });
  }

  ipRequests.push(now);
  requests[ip] = ipRequests;

  next();
};

export default rateLimiter;