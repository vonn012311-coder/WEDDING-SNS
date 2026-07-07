"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { weddingConfig } from "@/config";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function Hero() {
  const { coupleName, weddingDate, welcomeMessage } = weddingConfig;
  const [name1, name2] = coupleName.split(" & ");

  return (
    <header className="relative w-full h-[100dvh] min-h-[600px] overflow-hidden">
      {/* ── Full-screen background photo ── */}
      <Image
        src="/couple.png"
        alt="Couple photo"
        fill
        className="object-cover object-top"
        priority
        sizes="100vw"
      />

      {/* ── Gradient overlays for text readability ── */}
      {/* Top overlay — title area */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/60" />
      {/* Subtle cream tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a1f0a]/30 via-transparent to-[#1a1008]/50" />

      {/* ── Content — split top and bottom ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 flex flex-col items-center justify-between px-6 py-12 text-center"
      >
        {/* ── TOP: Scan & Snap label + Wedding title ── */}
        <div className="flex flex-col items-center">
          {/* "SCAN & SNAP" pill */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-[#E8D5A3]/70" />
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 12S1 8.5 1 4.5a3 3 0 016 0 3 3 0 016 0C13 8.5 7 12 7 12Z"
                  stroke="#E8D5A3"
                  strokeWidth="1.4"
                  fill="none"
                />
              </svg>
              <span className="font-inter text-[10px] font-semibold tracking-[0.28em] uppercase text-[#E8D5A3]">
                Scan &amp; Snap
              </span>
            </div>
            <span className="h-px w-10 bg-[#E8D5A3]/70" />
          </motion.div>

          {/* WEDDING */}
          <motion.p
            variants={itemVariants}
            className="font-serif text-3xl sm:text-5xl font-bold tracking-[0.3em] uppercase text-[#E8D5A3] mb-1 drop-shadow-lg"
          >
            Wedding
          </motion.p>

          {/* of */}
          <motion.p
            variants={itemVariants}
            className="font-script text-2xl sm:text-4xl text-[#E8D5A3] leading-tight mb-2 drop-shadow-md"
          >
            of
          </motion.p>
        </div>

        {/* ── BOTTOM: Names + date + welcome ── */}
        <div className="flex flex-col items-center">
          {/* Couple name */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold italic text-white leading-tight mb-4 drop-shadow-xl"
          >
            {name1} &amp; {name2}
          </motion.h1>

          {/* Date */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-5">
            <span className="w-8 h-px bg-[#E8D5A3]/60" />
            <span className="font-serif text-sm sm:text-base text-[#E8D5A3] italic tracking-widest drop-shadow-sm">
              {weddingDate}
            </span>
            <span className="w-8 h-px bg-[#E8D5A3]/60" />
          </motion.div>

          {/* Welcome message */}
          <motion.p
            variants={itemVariants}
            className="font-inter text-white/80 text-xs sm:text-sm leading-relaxed max-w-xs drop-shadow-sm"
          >
            {welcomeMessage}
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            variants={itemVariants}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="mt-8"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8D5A3" strokeWidth="1.5" opacity="0.7">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </header>
  );
}
