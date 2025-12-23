import { Router, Request, Response } from "express";
import { sendContactEmail } from "../services/emailService";
import { ApiResponse } from "../types";

const router = Router();

router.post(
  "/contact",
  async (req: Request, res: Response<ApiResponse<{ messageId: string }>>) => {
    try {
      // Accept any form data without validation
      const contactData = req.body;

      // Send email
      const result = await sendContactEmail(contactData);

      if (!result.success) {
        return res.status(500).json(result);
      }

      return res.status(200).json(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";

      return res.status(500).json({
        success: false,
        message: "Erreur interne du serveur",
        error: errorMessage,
      });
    }
  }
);

export default router;
