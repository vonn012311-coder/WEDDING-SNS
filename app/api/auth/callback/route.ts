import { NextRequest, NextResponse } from "next/server";
import { getOAuth2Client } from "@/lib/google-drive";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }

  try {
    const oauth2Client = getOAuth2Client();

    // Dynamically match the redirect URI of the request
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const redirectUri = `${protocol}://${host}/api/auth/callback`;
    oauth2Client.redirectUri = redirectUri;

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return new NextResponse(
        `
        <html>
          <head>
            <title>Warning: No Refresh Token</title>
            <style>
              body { font-family: sans-serif; padding: 40px; background: #FFF5F7; color: #7D3247; line-height: 1.6; }
              .card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); max-width: 600px; margin: 0 auto; border-top: 4px solid #f97ca0; }
              h1 { color: #d4748a; }
              .btn { display: inline-block; background: #E8A0B0; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; margin-top: 15px; }
              .btn:hover { background: #d4748a; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>⚠️ No Refresh Token Returned</h1>
              <p>Google did not send a refresh token. This usually happens if you already authorized this application previously.</p>
              <p>To fix this, please follow these steps:</p>
              <ol>
                <li>Go to your <a href="https://myaccount.google.com/connections" target="_blank" style="color:#b85a70; font-weight:bold;">Google Connections Account Page</a>.</li>
                <li>Find your project/app name and **Remove Access / Disconnect** it.</li>
                <li>Click the button below to re-authorize the app.</li>
              </ol>
              <a href="/api/auth" class="btn">Try Again</a>
            </div>
          </body>
        </html>
        `,
        { headers: { "Content-Type": "text/html" } }
      );
    }

    // Display the refresh token to the user
    return new NextResponse(
      `
      <html>
        <head>
          <title>Google OAuth Success</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; background: #FDFAF4; color: #333; line-height: 1.6; }
            .card { background: white; padding: 35px; border-radius: 16px; box-shadow: 0 8px 40px rgba(201, 168, 76, 0.1); max-width: 600px; margin: 40px auto; border: 1px solid rgba(201, 168, 76, 0.2); }
            h1 { color: #C9A84C; margin-top: 0; font-size: 24px; font-weight: 700; }
            p { font-size: 15px; color: #555; }
            pre { background: #fdfbf7; padding: 15px; border-radius: 8px; overflow-x: auto; font-size: 14px; border: 1px solid #ede2c2; font-family: monospace; word-break: break-all; white-space: pre-wrap; }
            .copy-btn { background: linear-gradient(135deg, #C9A84C 0%, #E8D5A3 100%); color: #5C4A08; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; shadow: 0 2px 10px rgba(0,0,0,0.05); }
            .copy-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(201, 168, 76, 0.3); }
            .footer { color: #888; font-size: 12px; margin-top: 25px; border-top: 1px dashed #eee; padding-top: 15px; }
            code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>🎉 Authorization Successful!</h1>
            <p>Google OAuth has authorized access to your Drive. Copy the Refresh Token below and add it to your environment variables on Vercel:</p>
            <p><strong>Variable Name:</strong> <code>GOOGLE_REFRESH_TOKEN</code></p>
            <pre id="token">${tokens.refresh_token}</pre>
            <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('token').innerText); alert('Copied to clipboard!');">📋 Copy Refresh Token</button>
            <div class="footer">
              ⚠️ <strong>Keep this token private!</strong> Anyone with access to this token can upload files to your Google Drive app scope.
            </div>
          </div>
        </body>
      </html>
      `,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error: any) {
    console.error("[OAUTH CALLBACK ERROR]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
