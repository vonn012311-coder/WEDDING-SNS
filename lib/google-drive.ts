/**
 * Google Drive OAuth 2.0 Upload Helper
 * Uses Google OAuth 2.0 credentials (Client ID, Client Secret, and Refresh Token)
 * to securely upload files on behalf of the host.
 */

import { google } from "googleapis";
import { Readable } from "stream";

// ── Initialize Google OAuth2 Client ─────────────────────────────────
export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  // Set redirect URI based on environment
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/auth/callback`
      : "http://localhost:3000/api/auth/callback");

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables. " +
        "Please check your Vercel/environment configuration."
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

// ── Upload a single file to Google Drive ─────────────────────────────
export async function uploadFileToDrive(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  folderId: string
): Promise<{ id: string; webViewLink: string }> {
  const oauth2Client = getOAuth2Client();
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!refreshToken) {
    throw new Error(
      "Missing GOOGLE_REFRESH_TOKEN environment variable. " +
        "Please complete the OAuth flow by visiting /api/auth first."
    );
  }

  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  // Convert Buffer to Readable stream
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const response = await drive.files.create({
    requestBody: {
      name: filename,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: "id, webViewLink",
  });

  return {
    id: response.data.id ?? "",
    webViewLink: response.data.webViewLink ?? "",
  };
}
