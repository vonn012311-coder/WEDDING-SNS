# Scan & Snap 📸💛

> A modern, elegant wedding photo-sharing web app. Guests scan a QR code, upload photos from their phone, and every image is automatically saved to your Google Drive folder — no login required.

---

## ✨ Features

- 📷 Upload from phone gallery or take a photo directly
- 🖼️ Multi-image upload with live preview
- ☁️ Automatic Google Drive upload (no manual downloading!)
- 🎉 Animated success screen with confetti
- 📱 Mobile-first responsive design
- 🔒 File type & size validation + rate limiting
- ⚙️ Easy admin config (no code changes needed)

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Animations | Framer Motion |
| Storage | Google Drive API v3 |
| Auth | Google Service Account |
| Deployment | Vercel |

---

## ⚙️ Admin Configuration

Edit [`config.ts`](./config.ts) to customize:

```ts
export const weddingConfig = {
  coupleName: "Vonn & Partner",      // ← Edit couple names
  weddingDate: "December 31, 2026",  // ← Edit date
  venue: "The Grand Ballroom",       // ← Edit venue
  welcomeMessage: "...",             // ← Edit welcome message
  googleDriveFolderId: "...",        // ← Set your Drive folder ID
  maxUploadSizeMB: 20,               // ← Max file size
};
```

---

## 🔧 Local Development

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/WEDDING-SNS.git
cd WEDDING-SNS
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
# Then edit .env.local with your credentials
```

### 3. Set up Google Drive (see below)

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Google Drive Setup (Step-by-Step)

### Step 1: Create a Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **"New Project"** → Name it `wedding-sns` → Click **Create**
3. Select the new project

### Step 2: Enable Google Drive API

1. Go to **APIs & Services → Library**
2. Search for **"Google Drive API"**
3. Click it → Click **"Enable"**

### Step 3: Create a Service Account

1. Go to **APIs & Services → Credentials**
2. Click **"+ Create Credentials" → "Service Account"**
3. Name: `wedding-uploader` → Click **Create and Continue** → Done
4. Click on the created service account
5. Go to **Keys** tab → **Add Key → Create new key → JSON**
6. Download the JSON file — **keep it safe!**

### Step 4: Create the Drive Folder

1. Go to [drive.google.com](https://drive.google.com)
2. Create a new folder (e.g., "Wedding Photos 2026")
3. Right-click the folder → **Share**
4. Paste the **service account email** (e.g., `wedding-uploader@wedding-sns.iam.gserviceaccount.com`)
5. Set role to **Editor** → Click **Share**
6. Copy the **Folder ID** from the URL:
   - URL: `https://drive.google.com/drive/folders/`**`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74`**
   - Folder ID: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74`

### Step 5: Configure Environment Variables

Add to `.env.local` (local) **and** Vercel dashboard (production):

```env
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}  # entire JSON, minified on one line
GOOGLE_DRIVE_FOLDER_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74
```

Also update `config.ts`:
```ts
googleDriveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID ?? "YOUR_FOLDER_ID"
```

---

## 🚢 Deployment to Vercel

### Automatic (GitHub → Vercel)

1. Push code to GitHub repo `WEDDING-SNS`
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import `WEDDING-SNS` from GitHub
4. Add environment variables in Vercel:
   - `GOOGLE_SERVICE_ACCOUNT_KEY` (paste entire JSON, minified)
   - `GOOGLE_DRIVE_FOLDER_ID`
5. Deploy!

### Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

---

## 📱 QR Code

Generate a QR code pointing to your Vercel URL:
- [qr-code-generator.com](https://www.qr-code-generator.com)
- [qrcode-monkey.com](https://www.qrcode-monkey.com)

URL: `https://wedding-sns.vercel.app`

Print and place QR codes on tables at your venue!

---

## 📁 Project Structure

```
.
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata)
│   ├── page.tsx            # Main page
│   ├── globals.css         # Global styles
│   └── api/upload/route.ts # Upload API → Google Drive
├── components/
│   ├── Hero.tsx            # Wedding header
│   ├── UploadZone.tsx      # Upload interface
│   ├── ImagePreview.tsx    # Photo preview grid
│   ├── ProgressBar.tsx     # Upload progress
│   └── SuccessScreen.tsx   # Success + confetti
├── lib/
│   └── google-drive.ts     # Drive API helper
├── config.ts               # ← Admin settings (edit this!)
├── .env.local.example      # Environment variables template
└── README.md
```

---

## 🛡️ Security

- Server-side file validation (type + size)
- IP-based rate limiting (30 uploads per 10 minutes)
- Service account scoped to `drive.file` only
- No user data stored on the server
- Non-image files are rejected

---

## 📄 License

MIT — Made with 💛 for your special day.
