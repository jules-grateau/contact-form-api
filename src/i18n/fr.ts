export const errorMessages = {
  configNotFound: (path: string) => `Fichier de configuration introuvable à ${path}. Veuillez vous assurer que config/settings.json existe.`,
  fromEmailMissing: "La variable d'environnement FROM_EMAIL doit être définie.",
  clientsConfigMissing: "La variable d'environnement CLIENTS_CONFIG doit être définie (format JSON).",
  clientsConfigInvalid: (error: string) => `CLIENTS_CONFIG doit être un JSON valide. Erreur : ${error}`,
  clientConfigNotFound: (clientId: string) => `Configuration client introuvable pour le clientId : ${clientId}`,
  unknownError: "Erreur inconnue",
  messageSizeExceedsLimit: "La taille du message dépasse la limite.",
  tooManyRequests: "Trop de requêtes depuis cette adresse IP. Veuillez réessayer plus tard.",
  emailSendFailed: "Échec de l'envoi du courriel",
  internalServerError: "Erreur interne du serveur",
  endpointNotFound: "Point de terminaison introuvable",
  notFound: "introuvable",
};

export const successMessages = {
  emailSendSuccess: "Courriel envoyé avec succès",
  apiOperational: "API opérationnelle",
};

export const generalMessages = {
  newContactFormSubmission: "Nouvelle soumission du formulaire de contact",
  unknown: "inconnu",
}