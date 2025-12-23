import { ApiResponse } from "../types";
import { resendClient } from "../utils/resend";
import { configManager } from "../utils/config";
import { generateEmailTemplate } from "../utils/emailTemplate";

export async function sendContactEmail(
  data: any,
  clientId: string
): Promise<ApiResponse<{ messageId: string }>> {
  try {
    const clientConfig = configManager.getClientConfig(clientId);
    const fromEmail = configManager.getFromEmail();

    const response = await resendClient.emails.send({
      from: `${clientConfig.fromName} <${fromEmail}>`,
      to: clientConfig.toEmail,
      subject: `Nouvelle soumission du formulaire de contact${
        data?.name ? ` de ${data.name}` : ""
      }`,
      html: generateEmailTemplate(data),
    });

    if (response.error) {
      return {
        success: false,
        message: "Échec de l'envoi du courriel",
        error: response.error.message,
      };
    }

    return {
      success: true,
      message: "Courriel envoyé avec succès",
      data: {
        messageId: response.data?.id || "inconnu",
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    return {
      success: false,
      message: "Échec de l'envoi du courriel",
      error: errorMessage,
    };
  }
}
