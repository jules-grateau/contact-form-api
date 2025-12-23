import { configManager } from "../utils/config";

export function generateEmailTemplate(data: any): string {
  const valueToString = (val: any) => {
    if (val === undefined || val === null) return "";
    if (typeof val === "string") return val;
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return String(val);
    }
  };

  // Build a list of all submitted fields (key => stringified value)
  const entries = Object.keys(data || {}).map((k) => [
    k,
    valueToString((data || {})[k]),
  ]);

  const fieldsHtml = entries
    .map(
      ([key, val]) => `
            <div class="field">
              <div class="label">${escapeHtml(String(key))}:</div>
              <div class="value">${escapeHtml(String(val)).replace(
                /\n/g,
                "<br>"
              )}</div>
            </div>`
    )
    .join("\n");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
          }
          .header {
            background-color: #0070f3;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
          }
          .content {
            background-color: white;
            padding: 20px;
            border-radius: 0 0 8px 8px;
          }
          .field {
            margin-bottom: 15px;
          }
          .label {
            font-weight: bold;
            color: #0070f3;
            margin-bottom: 5px;
          }
          .value {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            word-wrap: break-word;
          }
          .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nouvelle soumission du formulaire de contact</h1>
          </div>
          <div class="content">
${fieldsHtml}
            <div class="footer">
              <p>Ce courriel a été envoyé via ${
                configManager.getSettings().app.name
              }</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
