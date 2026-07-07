import Image from "next/image";
import Hero from "@/components/Hero";
import UploadZone from "@/components/UploadZone";

export default function Home() {
  return (
    <main id="main-content" className="relative min-h-screen">
      {/* ── Fixed couple photo background ── */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/couple.png"
          alt="Couple background"
          fill
          className="object-cover"
          style={{ objectPosition: "center 35%" }}
          priority
          sizes="100vw"
        />
        {/* Dark overlay so text is readable */}
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* ── Content stacked above photo ── */}
      <Hero />
      <UploadZone />

      {/* ── Footer ── */}
      <footer className="text-center py-8 px-4">
        <p className="font-inter text-xs tracking-[0.2em] uppercase text-white/40">
          Scan &amp; Snap Album · Made with Love
        </p>
      </footer>
    </main>
  );
}
