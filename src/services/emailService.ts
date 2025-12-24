import { ApiResponse } from "../types";
import { resendClient } from "../utils/resend";
import { configManager } from "../utils/config";
import { generateEmailTemplate } from "../utils/emailTemplate";
import { errorMessages, successMessages, generalMessages } from "../i18n/fr";

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
      subject: `${generalMessages.newContactFormSubmission}${
        data?.name ? ` de ${data.name}` : ""
      }`,
      html: generateEmailTemplate(data),
    });

    if (response.error) {
      return {
        success: false,
        message: errorMessages.emailSendFailed,
        error: response.error.message,
      };
    }

    return {
      success: true,
      message: successMessages.emailSendSuccess,
      data: {
        messageId: response.data?.id || generalMessages.unknown,
      },
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : errorMessages.unknownError;
    return {
      success: false,
      message: errorMessages.emailSendFailed,
      error: errorMessage,
    };
  }
}