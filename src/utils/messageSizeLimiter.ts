import { Request, Response, NextFunction } from "express";
import { configManager } from "./config";
import { errorMessages } from "../i18n/fr";

const messageSizeLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { clientId } = req.params;
  const clientConfig = configManager.getClientConfig(clientId);

  if (clientConfig.maxMessageSize && req.body.message) {
    const messageSize = Buffer.byteLength(req.body.message, "utf8");
    if (messageSize > clientConfig.maxMessageSize) {
      return res.status(413).json({
        success: false,
        message: errorMessages.messageSizeExceedsLimit,
      });
    }
  }
  next();
};

export default messageSizeLimiter;