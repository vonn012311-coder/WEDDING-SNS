import Hero from "@/components/Hero";
import UploadZone from "@/components/UploadZone";

export default function Home() {
  return (
    <main className="min-h-screen" id="main-content">
      {/* Floating petal decorations (CSS-only, no JS) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="petal absolute text-lg select-none"
            style={{
              left: `${10 + i * 15}%`,
              top: `${-5 + i * 3}%`,
              animationDelay: `${i * 1.3}s`,
              animationDuration: `${7 + i * 1.5}s`,
              fontSize: `${14 + (i % 3) * 6}px`,
            }}
          >
            {["✦", "✿", "❀", "✦", "❋", "✧"][i]}
          </span>
        ))}
      </div>

      {/* Hero Section */}
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
