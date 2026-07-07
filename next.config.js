/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["googleapis", "google-auth-library"],
  },
  images: {
    remotePatterns: [],
  },
};

module.exports = nextConfig;
