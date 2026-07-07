"use client";

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
    <motion.header
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center pt-14 pb-8 px-6"
    >
      {/* SCAN & SNAP */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
        <span className="h-px w-8 bg-[#E8D5A3]/60" />
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
        <span className="h-px w-8 bg-[#E8D5A3]/60" />
      </motion.div>

      {/* WEDDING of — tight together */}
      <motion.div variants={itemVariants} className="flex flex-col items-center leading-none mb-1">
        <span className="font-serif text-4xl sm:text-5xl font-bold tracking-[0.25em] uppercase text-white drop-shadow-lg">
          Wedding
        </span>
        <span className="font-script text-3xl sm:text-4xl text-[#E8D5A3] -mt-1 drop-shadow-md">
          of
        </span>
      </motion.div>

      {/* Couple name */}
      <motion.h1
        variants={itemVariants}
        className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold italic text-white leading-tight drop-shadow-xl mb-4"
      >
        {name1} &amp; {name2}
      </motion.h1>

      {/* Date */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-5">
        <span className="w-6 h-px bg-[#E8D5A3]/60" />
        <span className="font-serif text-sm text-[#E8D5A3] italic tracking-widest">
          {weddingDate}
        </span>
        <span className="w-6 h-px bg-[#E8D5A3]/60" />
      </motion.div>

      {/* Welcome message */}
      <motion.p
        variants={itemVariants}
        className="font-inter text-white font-semibold text-sm sm:text-base leading-relaxed max-w-xs sm:max-w-sm"
      >
        {welcomeMessage}
      </motion.p>
    </motion.header>
  );
}
