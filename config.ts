/**
 * ============================================================
 *  SCAN & SNAP — ADMIN CONFIGURATION
 *  Edit this file to customize your wedding app.
 *  No coding knowledge required!
 * ============================================================
 */

export const weddingConfig = {
  // ── Couple & Event ──────────────────────────────────────────
  coupleName: "Vonn & Partner",
  weddingDate: "December 31, 2026",
  venue: "The Grand Ballroom",

  // ── Messages ────────────────────────────────────────────────
  welcomeMessage:
    "Thank you for celebrating this special day with us. Share your favorite moments by uploading your photos below — every snapshot is a treasure we'll cherish forever. 💛",

  // ── Google Drive ────────────────────────────────────────────
  // Paste the Google Drive Folder ID here.
  // You can find it in the folder's URL:
  // https://drive.google.com/drive/folders/<FOLDER_ID>
  googleDriveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID ?? "1Q5-04R7QQlQRwM9FjO7A5xX6h7Zr_YmP",

  // ── Upload Limits ───────────────────────────────────────────
  maxUploadSizeMB: 20,
  allowedMimeTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/heic",
    "image/heif",
    "image/webp",
  ],

  // ── Thank-You Messages (shown randomly after upload) ────────
  thankYouMessages: [
    "Thank you for capturing our special day! 📸",
    "We're so grateful for your beautiful memories! 💛",
    "Your photo will be treasured forever. Thank you! 🌸",
    "Every picture tells our love story — thank you! 💍",
    "You've made our wedding album extra special! ✨",
    "With love and gratitude — thank you for sharing! 🥂",
    "These moments are priceless. Thank you so much! 🌹",
    "Your photo is now part of our forever story! 💕",
  ],
};
