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
- `PORT` — server port (default: `3000`)
- `NODE_ENV` — environment (`development`/`production`)

### Local development

Create a local `.env` file in the project root (copy from `.env.example`):

```env
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=sender@yourdomain.com
PORT=3000
NODE_ENV=development
```

**Important**: `.env` is in `.gitignore` and will not be committed. Each developer should create their own `.env` with their credentials.

### Running with Docker / production

Pass environment variables directly to the container:

```bash
docker run -p 3000:3000 \
  -e RESEND_API_KEY=your_key \
  -e FROM_EMAIL=sender@domain.com \
  contact-form-api:1.0.0
```

## Running locally

Install dependencies and run in development:

```bash
npm install
npm run dev
```

The server will start and read `.env` automatically (make sure `RESEND_API_KEY` and `FROM_EMAIL` are set in `.env`).

## API Endpoints

### POST /api/contact

Accepts any JSON body and sends an email listing all fields and their content. Example request:

```bash
curl -X POST http://localhost:3000/api/contact \
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

Errors are returned in French (e.g. `"Erreur interne du serveur"`).

### GET /health

Health check — returns a 200 JSON response in French:

```json
{ "success": true, "message": "API opérationnelle", "timestamp": "..." }
```

## Configuration

`config/settings.json` contains application settings:

```json
{
  "app": { "name": "Contact Form API", "version": "1.0.0" },
  "email": {
    "toEmail": "recipient@example.com",
    "fromName": "Formulaire de Contact"
  },
  "api": { "port": 3000, "prefix": "/api" }
}
```

- **`toEmail`** — recipient address for form submissions
- **`fromName`** — sender name displayed in emails
- **`fromEmail`** — NOT in config; use the `FROM_EMAIL` environment variable instead

## Docker

The `docker-compose.yml` passes `FROM_EMAIL` and `RESEND_API_KEY` into the container. Example:

```bash
FROM_EMAIL=sender@domain.com RESEND_API_KEY=your_key docker-compose up
```

Or set them in your local `.env` and run:

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
