"use client";

import { motion, AnimatePresence } from "framer-motion";

interface FileItem {
  id: string;
  file: File;
  preview: string;
  name: string;
  sizeMB: string;
}

interface ImagePreviewProps {
  files: FileItem[];
  onRemove: (id: string) => void;
}

export default function ImagePreview({ files, onRemove }: ImagePreviewProps) {
  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-gray-700 font-medium text-base">
          {files.length} photo{files.length !== 1 ? "s" : ""} selected
        </h3>
        <span className="font-inter text-xs text-gray-400">Tap ✕ to remove</span>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-3 sm:grid-cols-4 gap-2"
      >
        <AnimatePresence>
          {files.map((f) => (
            <motion.div
              key={f.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.2 } }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="preview-card group aspect-square bg-cream-100"
            >
              {/* Image thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.preview}
                alt={f.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IiNGNUVERDQiLz48dGV4dCB4PSI0MCIgeT0iNDUiIGZvbnQtZmFtaWx5PSJzZXJpZiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0M5QTg0QyI+8J+TuTwvdGV4dD48L3N2Zz4=";
                }}
              />

              {/* File info overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-end">
                <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="font-inter text-white text-xs truncate leading-tight">{f.name}</p>
                  <p className="font-inter text-white/70 text-xs">{f.sizeMB}</p>
                </div>
              </div>

              {/* Remove button */}
              <button
                className="remove-btn group-hover:opacity-100"
                onClick={() => onRemove(f.id)}
                aria-label={`Remove ${f.name}`}
                id={`remove-${f.id}`}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1l8 8M9 1L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
