"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;       // 0–100
  uploadedCount: number;
  totalCount: number;
}

export default function ProgressBar({ progress, uploadedCount, totalCount }: ProgressBarProps) {
  return (
    <div className="text-center py-4">
      {/* Spinner + label */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-7 h-7 rounded-full border-2 border-gold-200 border-t-gold-500"
        />
        <p className="font-serif text-gray-700 text-lg">
          Uploading to the cloud…
        </p>
      </div>

      {/* Progress track */}
      <div className="relative h-3 bg-cream-200 rounded-full overflow-hidden shadow-inner">
        <motion.div
          className="absolute top-0 left-0 h-full progress-bar-fill rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Progress text */}
      <div className="flex items-center justify-between mt-2">
        <p className="font-inter text-xs text-gray-400">
          {uploadedCount} of {totalCount} photo{totalCount !== 1 ? "s" : ""}
        </p>
        <p className="font-inter text-xs font-semibold text-gold-600">{progress}%</p>
      </div>

      <p className="font-inter text-xs text-gray-400 mt-3">
        Please keep this page open until the upload completes
      </p>
    </div>
  );
}
