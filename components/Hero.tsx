"use client";

import { motion } from "framer-motion";
import { weddingConfig } from "@/config";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
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
    <header className="relative pt-14 pb-10 px-5 text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center"
      >
        {/* ── "SCAN & SNAP" pill with heart ── */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 mb-7"
        >
          <span className="flex-1 h-px w-10 bg-gradient-to-r from-transparent to-gold-400" />
          <div className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 12S1 8.5 1 4.5a3 3 0 016 0 3 3 0 016 0C13 8.5 7 12 7 12Z"
                stroke="#C9A84C"
                strokeWidth="1.3"
                fill="none"
              />
            </svg>
            <span className="font-inter text-xs font-semibold tracking-[0.25em] uppercase text-[#C9A84C]">
              Scan &amp; Snap
            </span>
          </div>
          <span className="flex-1 h-px w-10 bg-gradient-to-l from-transparent to-[#C9A84C]" />
        </motion.div>

        {/* ── WEDDING ── */}
        <motion.p
          variants={itemVariants}
          className="font-serif text-4xl sm:text-5xl font-bold tracking-[0.25em] uppercase text-[#C9A84C] mb-1"
        >
          Wedding
        </motion.p>

        {/* ── "of" script ── */}
        <motion.p
          variants={itemVariants}
          className="font-script text-3xl sm:text-4xl text-[#C9A84C] leading-tight mb-1"
        >
          of
        </motion.p>

        {/* ── Couple name ── */}
        <motion.h1
          variants={itemVariants}
          className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold italic text-gray-800 leading-tight mb-5"
        >
          {name1} &amp; {name2}
        </motion.h1>

        {/* ── Date with dashes ── */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 mb-8"
        >
          <span className="w-8 h-px bg-[#cfc08f]/50" />
          <span className="font-serif text-base sm:text-lg text-[#C9A84C] italic tracking-wide">
            {weddingDate}
          </span>
          <span className="w-8 h-px bg-[#cfc08f]/50" />
        </motion.div>

        {/* ── Welcome message ── */}
        <motion.p
          variants={itemVariants}
          className="font-inter text-slate-600 font-medium text-sm sm:text-base leading-relaxed max-w-sm"
        >
          {welcomeMessage}
        </motion.p>
      </motion.div>
    </header>
  );
}
