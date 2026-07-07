import Hero from "@/components/Hero";
import UploadZone from "@/components/UploadZone";

export default function Home() {
  return (
    <main id="main-content">
      {/* Hero Section — full screen couple photo */}
      <Hero />

      {/* Upload Section */}
      <UploadZone />

      {/* Footer */}
      <footer className="text-center pb-10 px-4">
        <p className="font-inter text-xs text-gray-400">
          Made with love for your special day · Scan &amp; Snap
        </p>
      </footer>
    </main>
  );
}
