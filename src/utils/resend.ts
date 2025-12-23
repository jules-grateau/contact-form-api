import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error(
    "La variable d'environnement RESEND_API_KEY n'est pas définie"
  );
}

export const resendClient = new Resend(apiKey);
