"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { weddingConfig } from "@/config";

interface SuccessScreenProps {
  onUploadMore: () => void;
}

// Random thank-you message
function getRandomMessage() {
  const msgs = weddingConfig.thankYouMessages;
  return msgs[Math.floor(Math.random() * msgs.length)];
}

// Confetti launcher (lazy-loaded to avoid SSR issues)
async function launchConfetti() {
  try {
    const confetti = (await import("canvas-confetti")).default;
    const colors = ["#C9A84C", "#E8D5A3", "#E8A0B0", "#FFF0F3", "#FFFFFF"];

    // First burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.3, y: 0.5 },
      colors,
      shapes: ["circle", "square"],
      scalar: 0.9,
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: 0.7, y: 0.5 },
        colors,
        shapes: ["circle", "square"],
        scalar: 0.9,
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 120,
        origin: { x: 0.5, y: 0.4 },
        colors,
        gravity: 0.8,
        scalar: 0.7,
      });
    }, 400);
  } catch {
    // Graceful fallback if confetti fails
  }
}

export default function SuccessScreen({ onUploadMore }: SuccessScreenProps) {
  const messageRef = useRef(getRandomMessage());

  useEffect(() => {
    launchConfetti();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
      className="max-w-2xl mx-auto px-4 pb-20"
    >
      <div className="glass-card rounded-4xl p-10 sm:p-14 shadow-wedding-lg text-center">
        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
          className="mx-auto mb-6 w-24 h-24 rounded-full bg-gradient-to-br from-gold-100 to-blush-100 flex items-center justify-center shadow-wedding"
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="#C9A84C" strokeWidth="2" fill="none" />
            <path
              className="check-path"
              d="M12 24l8 8 16-16"
              stroke="#C9A84C"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-serif text-3xl sm:text-4xl font-bold text-gold-gradient mb-3"
        >
          Upload Successful!
        </motion.h2>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mx-auto mb-5 h-px w-24 bg-gradient-to-r from-transparent via-gold-400 to-transparent"
        />

        {/* Thank-you message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-serif text-lg sm:text-xl text-gray-700 italic mb-2 leading-relaxed"
        >
          &#8220;{messageRef.current}&#8221;
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="font-inter text-sm text-gray-400 mb-8"
        >
          Your photo has been saved to our wedding album ✨
        </motion.p>

        {/* Decorative hearts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-3 mb-8"
        >
          {["💛", "📸", "💍", "🌸", "✨"].map((emoji, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.08, type: "spring", stiffness: 300 }}
              className="text-xl"
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>

        {/* Upload more button */}
        <motion.button
          id="upload-more-btn"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onUploadMore}
          className="btn-gold w-full sm:w-auto px-10 py-4 rounded-2xl font-inter font-semibold text-base tracking-wide shadow-wedding"
        >
          📸 Upload More Photos
        </motion.button>
      </div>
    </motion.div>
  );
}
