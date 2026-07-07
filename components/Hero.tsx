"use client";

import { motion } from "framer-motion";
import { weddingConfig } from "@/config";

// Decorative SVG elements
const RingIcon = () => (
  <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="28" cy="40" r="18" stroke="#C9A84C" strokeWidth="4" fill="none" />
    <circle cx="52" cy="40" r="18" stroke="#E8D5A3" strokeWidth="4" fill="none" />
    <circle cx="28" cy="40" r="10" stroke="#C9A84C" strokeWidth="1.5" fill="none" strokeDasharray="2 3" />
    <circle cx="52" cy="40" r="10" stroke="#E8D5A3" strokeWidth="1.5" fill="none" strokeDasharray="2 3" />
  </svg>
);

const FloralDecoration = () => (
  <svg viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-8 opacity-60">
    <path d="M10 15 Q20 5 30 15 Q20 25 10 15Z" fill="#E8A0B0" opacity="0.5" />
    <path d="M20 15 Q30 5 40 15 Q30 25 20 15Z" fill="#C9A84C" opacity="0.4" />
    <path d="M60 15 L55 10 M60 15 L65 10 M60 15 L55 20 M60 15 L65 20 M60 15 L50 15 M60 15 L70 15" stroke="#C9A84C" strokeWidth="1" strokeLinecap="round" />
    <path d="M80 15 Q90 5 100 15 Q90 25 80 15Z" fill="#C9A84C" opacity="0.4" />
    <path d="M90 15 Q100 5 110 15 Q100 25 90 15Z" fill="#E8A0B0" opacity="0.5" />
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const ringVariants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export default function Hero() {
  const { coupleName, weddingDate, venue, welcomeMessage } = weddingConfig;
  const [name1, name2] = coupleName.split(" & ");

  return (
    <header className="relative overflow-hidden">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blush-100 opacity-30 blur-3xl" />
        <div className="absolute -top-16 -right-32 w-80 h-80 rounded-full bg-gold-100 opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-48 bg-gradient-to-t from-cream-50 to-transparent" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-5"
        >
          {/* Rings Icon */}
          <motion.div
            variants={ringVariants}
            className="w-20 h-20 animate-float"
            aria-hidden="true"
          >
            <RingIcon />
          </motion.div>

          {/* "Scan & Snap" tagline */}
          <motion.p
            variants={itemVariants}
            className="font-script text-2xl text-gold-500 tracking-wide"
          >
            Scan & Snap
          </motion.p>

          {/* Couple Names */}
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-1">
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
              <span className="text-gold-gradient">{name1}</span>
              <span className="block font-script text-4xl sm:text-5xl text-blush-500 my-1">&amp;</span>
              <span className="text-gold-gradient">{name2}</span>
            </h1>
          </motion.div>

          {/* Floral divider */}
          <motion.div variants={itemVariants} className="flex items-center justify-center">
            <FloralDecoration />
          </motion.div>

          {/* Date & Venue */}
          <motion.div variants={itemVariants} className="flex flex-col items-center gap-1">
            <p className="font-serif text-lg text-gold-600 font-medium tracking-widest uppercase text-sm">
              {weddingDate}
            </p>
            {venue && (
              <p className="font-inter text-sm text-gray-500 tracking-wide">{venue}</p>
            )}
          </motion.div>

          {/* Ornament divider */}
          <motion.div variants={itemVariants} className="ornament-divider w-full max-w-xs">
            <span className="text-gold-400 text-lg">✦</span>
          </motion.div>

          {/* Welcome message */}
          <motion.p
            variants={itemVariants}
            className="font-inter text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl"
          >
            {welcomeMessage}
          </motion.p>

          {/* Scroll cue */}
          <motion.div
            variants={itemVariants}
            className="mt-4 flex flex-col items-center gap-2 text-gold-400"
          >
            <span className="font-inter text-xs uppercase tracking-widest text-gold-500">
              Upload your photos below
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4v12M4 10l6 6 6-6" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
