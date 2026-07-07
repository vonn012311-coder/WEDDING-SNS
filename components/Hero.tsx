"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { weddingConfig } from "@/config";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
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
        className="object-cover"
        style={{ objectPosition: "center 35%" }}
        priority
        sizes="100vw"
      />

      {/* ── Dark gradient overlay for readability ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/65" />

      {/* ── All text CENTERED in the middle of screen ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center gap-1"
      >
        {/* SCAN & SNAP */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-3">
          <span className="h-px w-8 bg-[#E8D5A3]/70" />
          <div className="flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
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
          <span className="h-px w-8 bg-[#E8D5A3]/70" />
        </motion.div>

        {/* WEDDING of Vonn & Partner — all together, no gap */}
        <motion.div variants={itemVariants} className="flex flex-col items-center leading-none">
          <span className="font-serif text-3xl sm:text-4xl font-bold tracking-[0.25em] uppercase text-[#E8D5A3] drop-shadow-lg">
            Wedding
          </span>
          <span className="font-script text-2xl sm:text-3xl text-[#E8D5A3] leading-snug -mt-1 drop-shadow-md">
            of
          </span>
        </motion.div>

        {/* Couple name */}
        <motion.h1
          variants={itemVariants}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold italic text-white leading-tight drop-shadow-xl mt-1"
        >
          {name1} &amp; {name2}
        </motion.h1>

        {/* Date */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 mt-3">
          <span className="w-6 h-px bg-[#E8D5A3]/60" />
          <span className="font-serif text-sm text-[#E8D5A3] italic tracking-widest drop-shadow-sm">
            {weddingDate}
          </span>
          <span className="w-6 h-px bg-[#E8D5A3]/60" />
        </motion.div>

        {/* Welcome message */}
        <motion.p
          variants={itemVariants}
          className="font-inter text-white/75 text-xs sm:text-sm leading-relaxed max-w-xs mt-4 drop-shadow-sm"
        >
          {welcomeMessage}
        </motion.p>
      </motion.div>

      {/* ── Bouncing scroll hint at bottom ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 1.5 }, y: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8D5A3" strokeWidth="1.5" opacity="0.7">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </header>
  );
}
