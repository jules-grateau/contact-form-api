# Contact Form API

Repository: https://github.com/jules-grateau/contact-form-api.git

A compact Node.js/Express/TypeScript REST API that receives contact-form submissions and sends them by email using the Resend service.

## Features

- Single `POST /api/contact` endpoint
- Email delivery via the `resend` library
- Minimal, maintainable structure (`routes`, `services`, `utils`)
- TypeScript code with strict settings
- Docker-ready with multi-stage build
- Health check at `/health`

## Project Structure

See the main files:

```
contact-form-api/
├── src/
│   ├── index.ts                 # Express app entry point (loads .env first)
│   ├── routes/contact.ts        # /api/contact route
│   ├── services/emailService.ts # Sends email via Resend
│   └── utils/                   # helpers (config, template, resend client)
├── config/settings.json         # App settings (note: fromEmail is ignored, use FROM_EMAIL)
├── Dockerfile
├── docker-compose.yml
├── package.json
└── .env.example
```

## Environment variables

Required environment variables:

- `RESEND_API_KEY` — your Resend API key (required)
- `FROM_EMAIL` — sender email address used in the `From:` header (required)
- `CLIENTS_CONFIG` — JSON object defining clients and their email recipients (required)
- `PORT` — server port (default: `3000`)
- `NODE_ENV` — environment (`development`/`production`)

### Local development

Create a local `.env` file in the project root:

```env
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=sender@yourdomain.com
PORT=3000
NODE_ENV=development
CLIENTS_CONFIG={"default":{"toEmail":"recipient@example.com","fromName":"Contact Form"},"acme":{"toEmail":"acme@example.com","fromName":"ACME Form"}}
```

**Important**:

- `.env` is in `.gitignore` and will not be committed. Each developer should create their own `.env` with their credentials.
- `CLIENTS_CONFIG` must be valid JSON. Include all clients you want to support.

### Running with Docker / production

Pass environment variables directly to the container:

```bash
docker run -p 3000:3000 \
  -e RESEND_API_KEY=your_key \
  -e FROM_EMAIL=sender@domain.com \
  -e CLIENTS_CONFIG='{"default":{"toEmail":"recipient@domain.com","fromName":"Form"}}' \
  contact-form-api:1.0.0
```

Or with Docker Compose (reads from `.env`):

```bash
docker-compose up
```

## API Endpoints

### POST /api/contact/:clientId

Accepts any JSON body and sends an email listing all fields and their content to the recipient configured for that client. The `clientId` identifies which client configuration to use.

Example request:

```bash
curl -X POST http://localhost:3000/api/contact/default \
  -H "Content-Type: application/json" \
  -d '{"name":"Jean","email":"jean@example.com","message":"Bonjour"}'
```

Example success response (French):

```json
{
  "success": true,
  "message": "Courriel envoyé avec succès",
  "data": { "messageId": "..." }
}
```

If `clientId` does not exist in the configuration, a 500 error is returned with message `"Échec de l'envoi du courriel"`.

Errors are returned in French (e.g. `"Erreur interne du serveur"`).

### GET /health

Health check — returns a 200 JSON response in French:

```json
{ "success": true, "message": "API opérationnelle", "timestamp": "..." }
```

## Configuration

`config/settings.json` contains minimal app-level settings (app name, version, port, prefix). All sensitive or client-specific data comes from environment variables.

Client configurations are defined in the `CLIENTS_CONFIG` environment variable as a JSON object. Each client ID maps to an object with:

- **`toEmail`** — recipient address for form submissions
- **`fromName`** — sender name displayed in emails

Example `CLIENTS_CONFIG`:

```json
{
  "default": {
    "toEmail": "default@example.com",
    "fromName": "Default Contact Form"
  },
  "acme-corp": {
    "toEmail": "forms@acme.com",
    "fromName": "ACME Contact Form"
  }
}
```

Add this to your `.env` file as a single line (JSON must be valid):

```env
CLIENTS_CONFIG={"default":{"toEmail":"default@example.com","fromName":"Default Contact Form"},"acme-corp":{"toEmail":"forms@acme.com","fromName":"ACME Contact Form"}}
```

## Docker

The `docker-compose.yml` passes `FROM_EMAIL`, `RESEND_API_KEY`, and `CLIENTS_CONFIG` into the container. Set them in your local `.env` and run:

```bash
docker-compose up
```

## Notes

- The API intentionally accepts any JSON payload — there is no validation. The email template will render each field and its stringified value.
- Keep your API keys and `FROM_EMAIL` secret and out of source control.

## Next steps / Suggestions

- Add authentication or an API key to protect the endpoint if it will be exposed publicly.
- Add logging/monitoring (Winston, Pino, Sentry).
- Add rate-limiting / abuse protection.

## License

MIT
