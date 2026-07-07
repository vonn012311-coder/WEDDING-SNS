import { NextRequest, NextResponse } from "next/server";
import { getOAuth2Client } from "@/lib/google-drive";

export async function GET(req: NextRequest) {
  try {
    const oauth2Client = getOAuth2Client();

    // Use custom redirect URI if passed via query param (useful for local testing)
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const redirectUri = `${protocol}://${host}/api/auth/callback`;
    oauth2Client.redirectUri = redirectUri;

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline", // Required to get a refresh token
      prompt: "consent",      // Forces consent screen to ensure refresh token is returned
      scope: ["https://www.googleapis.com/auth/drive.file"],
    });

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error("[OAUTH INITIALIZE ERROR]", error);
    return NextResponse.json(
      {
        error: "Failed to initialize Google OAuth.",
        details: error.message,
        tip: "Make sure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in your environment variables.",
      },
      { status: 500 }
    );
  }
}
