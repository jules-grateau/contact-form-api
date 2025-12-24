import { Router, Request, Response } from "express";
import { sendContactEmail } from "../services/emailService";
import messageSizeLimiter from "../utils/messageSizeLimiter";
import rateLimiter from "../utils/rateLimiter";
import { ApiResponse } from "../types";
import { errorMessages } from "../i18n/fr";

const router = Router();

router.post(
  "/contact/:clientId",
  messageSizeLimiter,
  rateLimiter,
  async (req: Request, res: Response<ApiResponse<{ messageId: string }>>) => {
    try {
      const { clientId } = req.params;
      const contactData = req.body;

      // Send email with client-specific configuration
      const result = await sendContactEmail(contactData, clientId);

      if (!result.success) {
        return res.status(500).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : errorMessages.unknownError;

      return res.status(500).json({
        success: false,
        message: errorMessages.internalServerError,
        error: errorMessage,
      });
    }
  }
);

export default router;