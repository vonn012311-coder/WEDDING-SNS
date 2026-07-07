/**
 * Google Drive Upload Helper
 * Uses a Service Account to authenticate and upload files.
 * The service account must have write access to the target Drive folder.
 */

import { google } from "googleapis";
import { Readable } from "stream";

// ── Initialize Google Auth ─────────────────────────────────────
function getAuth() {
  const keyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyRaw) {
    throw new Error(
      "Missing GOOGLE_SERVICE_ACCOUNT_KEY environment variable. " +
        "See README.md for setup instructions."
    );
  }

  let credentials: object;
  try {
    credentials = JSON.parse(keyRaw);
  } catch {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not valid JSON.");
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  return auth;
}

// ── Upload a single file to Google Drive ─────────────────────
export async function uploadFileToDrive(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  folderId: string
): Promise<{ id: string; webViewLink: string }> {
  const auth = getAuth();
  const drive = google.drive({ version: "v3", auth });

  // Convert Buffer to Readable stream (required by Drive API)
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
