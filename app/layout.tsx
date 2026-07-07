import type { Metadata } from "next";
import { Playfair_Display, Inter, Great_Vibes } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scan & Snap — Share Your Wedding Memories",
  description:
    "Upload your favorite photos from the wedding celebration and help us build a beautiful shared album. Every snapshot is a treasure we'll cherish forever.",
  keywords: ["wedding", "photos", "memories", "upload", "celebration"],
  openGraph: {
    title: "Scan & Snap — Wedding Photo Sharing",
    description: "Share your beautiful wedding memories with us!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${greatVibes.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#FDFAF4" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans antialiased bg-cream-50 text-gray-800 min-h-screen">
        {children}
      </body>
    </html>
  );
}
