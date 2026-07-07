"use client";

import Image from "next/image";
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
    <header className="relative overflow-hidden text-center">
      {/* ── Background couple photo ── */}
      <div className="relative w-full h-[420px] sm:h-[500px] md:h-[560px]">
        <Image
          src="/couple.png"
          alt="Couple photo"
          fill
          className="object-cover object-center"
          priority
        />

        {/* Top cream gradient — makes title text readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FDFAF4]/90 via-[#FDFAF4]/20 to-[#FDFAF4]/80" />

        {/* Text overlay — centered on the photo */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-0 flex flex-col items-center justify-center px-5 pt-8"
        >
          {/* ── "SCAN & SNAP" pill ── */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 mb-4"
          >
            <span className="flex-1 h-px w-8 bg-gradient-to-r from-transparent to-[#C9A84C]" />
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 12S1 8.5 1 4.5a3 3 0 016 0 3 3 0 016 0C13 8.5 7 12 7 12Z"
                  stroke="#C9A84C"
                  strokeWidth="1.3"
                  fill="none"
                />
              </svg>
              <span className="font-inter text-[10px] font-semibold tracking-[0.25em] uppercase text-[#C9A84C]">
                Scan &amp; Snap
              </span>
            </div>
            <span className="flex-1 h-px w-8 bg-gradient-to-l from-transparent to-[#C9A84C]" />
          </motion.div>

          {/* ── WEDDING ── */}
          <motion.p
            variants={itemVariants}
            className="font-serif text-3xl sm:text-5xl font-bold tracking-[0.25em] uppercase text-[#C9A84C] mb-0.5"
          >
            Wedding
          </motion.p>

          {/* ── "of" script ── */}
          <motion.p
            variants={itemVariants}
            className="font-script text-2xl sm:text-4xl text-[#C9A84C] leading-tight mb-0.5"
          >
            of
          </motion.p>

          {/* ── Couple name ── */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold italic text-gray-800 leading-tight mb-4 drop-shadow-sm"
          >
            {name1} &amp; {name2}
          </motion.h1>

          {/* ── Date ── */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3"
          >
            <span className="w-6 h-px bg-[#C9A84C]/60" />
            <span className="font-serif text-sm sm:text-base text-[#C9A84C] italic tracking-wide drop-shadow-sm">
              {weddingDate}
            </span>
            <span className="w-6 h-px bg-[#C9A84C]/60" />
          </motion.div>
        </motion.div>
      </div>

      {/* ── Welcome message — below the photo ── */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="font-inter text-slate-600 font-medium text-sm sm:text-base leading-relaxed max-w-sm mx-auto px-5 pt-6 pb-4"
      >
        {welcomeMessage}
      </motion.p>
    </header>
  );
}
