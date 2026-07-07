/**
 * POST /api/upload
 *
 * Accepts multipart/form-data with a single field "file".
 * Validates the file type and size, then uploads it to Google Drive.
 *
 * Returns:
 *   200 { success: true, fileId, webViewLink }
 *   400 { success: false, error: string }
 *   500 { success: false, error: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { uploadFileToDrive } from "@/lib/google-drive";
import { weddingConfig } from "@/config";

// ── Rate-limiting (simple in-memory, resets on cold start) ────
const uploadCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 30;           // max uploads per IP per window
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = uploadCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    uploadCounts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

// ── Helpers ───────────────────────────────────────────────────
function generateFilename(original: string): string {
  const ext = original.split(".").pop() ?? "jpg";
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `wedding_${ts}_${rand}.${ext}`;
}

// ── Handler ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // ── IP-based rate limiting ──
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many uploads. Please try again later." },
      { status: 429 }
    );
  }

  // ── Parse multipart form ──
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request format." },
      { status: 400 }
    );
  }

  const fileEntry = formData.get("file");
  if (!fileEntry || typeof fileEntry === "string") {
    return NextResponse.json(
      { success: false, error: "No file provided." },
      { status: 400 }
    );
  }

  const file = fileEntry as File;

  // ── Validate MIME type ──
  const isAllowedMime = weddingConfig.allowedMimeTypes.some(
    (t) =>
      file.type === t ||
      (t === "image/heic" && file.name.toLowerCase().endsWith(".heic")) ||
      (t === "image/heif" && file.name.toLowerCase().endsWith(".heif"))
  );

  if (!isAllowedMime) {
    return NextResponse.json(
      {
        success: false,
        error: `File type "${file.type || "unknown"}" is not allowed. Please upload JPG, PNG, or HEIC files.`,
      },
      { status: 400 }
    );
  }

  // ── Validate file size ──
  const maxBytes = weddingConfig.maxUploadSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        success: false,
        error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed is ${weddingConfig.maxUploadSizeMB}MB.`,
      },
      { status: 400 }
    );
  }

  // ── Read file as buffer ──
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // ── Determine MIME for Drive (fallback for HEIC) ──
  const mimeType =
    file.type || (file.name.toLowerCase().endsWith(".heic") ? "image/heic" : "image/jpeg");

  // ── Upload to Google Drive ──
  const folderId = weddingConfig.googleDriveFolderId;

  if (!folderId || folderId === "YOUR_FOLDER_ID_HERE") {
    return NextResponse.json(
      {
        success: false,
        error: "Google Drive folder is not configured. Please contact the administrator.",
      },
      { status: 500 }
    );
  }

  try {
    const filename = generateFilename(file.name);
    const result = await uploadFileToDrive(buffer, filename, mimeType, folderId);

    return NextResponse.json({
      success: true,
      fileId: result.id,
      webViewLink: result.webViewLink,
      filename,
    });
  } catch (err) {
    console.error("[UPLOAD ERROR]", err);
    return NextResponse.json(
      {
        success: false,
        error: "Upload to Google Drive failed. Please try again.",
      },
      { status: 500 }
    );
  }
}

// ── Only allow POST ───────────────────────────────────────────
export async function GET() {
  return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
}
