"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImagePreview from "./ImagePreview";
import ProgressBar from "./ProgressBar";
import SuccessScreen from "./SuccessScreen";
import { weddingConfig } from "@/config";

// ── Types ──────────────────────────────────────────────────────
interface SelectedFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  sizeMB: string;
}

type UploadState = "idle" | "uploading" | "success" | "error";

// ── Helpers ────────────────────────────────────────────────────
function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

function formatSize(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const ALLOWED_TYPES = weddingConfig.allowedMimeTypes;
const MAX_BYTES = weddingConfig.maxUploadSizeMB * 1024 * 1024;

// ── Upload Zone Component ─────────────────────────────────────
export default function UploadZone() {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  // ── File Validation & Processing ────────────────────────────
  const processFiles = useCallback((rawFiles: FileList | File[]) => {
    const fileArray = Array.from(rawFiles);
    const errors: string[] = [];
    const valid: SelectedFile[] = [];

    for (const file of fileArray) {
      // Check MIME type
      const isValidType = ALLOWED_TYPES.some(
        (t) =>
          file.type === t ||
          (t === "image/heic" && file.name.toLowerCase().endsWith(".heic")) ||
          (t === "image/heif" && file.name.toLowerCase().endsWith(".heif"))
      );
      if (!isValidType) {
        errors.push(`"${file.name}" is not a supported image format.`);
        continue;
      }
      // Check size
      if (file.size > MAX_BYTES) {
        errors.push(`"${file.name}" exceeds the ${weddingConfig.maxUploadSizeMB}MB limit.`);
        continue;
      }
      // Create preview (HEIC may not render in browser, use placeholder)
      const preview =
        file.type.startsWith("image/") && !file.type.includes("heic") && !file.type.includes("heif")
          ? URL.createObjectURL(file)
          : "/heic-placeholder.png";

      valid.push({
        id: generateId(),
        file,
        preview,
        name: file.name,
        sizeMB: formatSize(file.size),
      });
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join("\n"));
      setTimeout(() => setErrorMessage(null), 5000);
    }

    setFiles((prev) => {
      // Avoid duplicate filenames
      const existingNames = new Set(prev.map((f) => f.name));
      return [...prev, ...valid.filter((v) => !existingNames.has(v.name))];
    });
  }, []);

  // ── Drag & Drop ─────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length) processFiles(e.dataTransfer.files);
  };

  // ── Remove file ──────────────────────────────────────────────
  const removeFile = (id: string) => {
    setFiles((prev) => {
      const f = prev.find((x) => x.id === id);
      if (f && f.preview.startsWith("blob:")) URL.revokeObjectURL(f.preview);
      return prev.filter((x) => x.id !== id);
    });
  };

  // ── Upload ───────────────────────────────────────────────────
  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploadState("uploading");
    setProgress(0);
    setErrorMessage(null);

    const total = files.length;
    let successCount = 0;
    const failedFiles: string[] = [];

    for (let i = 0; i < total; i++) {
      const { file } = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          failedFiles.push(file.name);
          console.error("Upload failed for", file.name, data);
        } else {
          successCount++;
        }
      } catch {
        failedFiles.push(file.name);
      }

      // Update progress after each file
      setProgress(Math.round(((i + 1) / total) * 100));
      setUploadedCount(i + 1);
    }

    // Cleanup blob URLs
    files.forEach((f) => {
      if (f.preview.startsWith("blob:")) URL.revokeObjectURL(f.preview);
    });

    if (successCount === total) {
      setUploadState("success");
    } else if (successCount > 0) {
      // Partial success
      setUploadState("success");
      setErrorMessage(`${failedFiles.length} file(s) failed to upload: ${failedFiles.join(", ")}`);
    } else {
      setUploadState("error");
      setErrorMessage("Upload failed. Please try again.");
    }
  };

  // ── Reset ────────────────────────────────────────────────────
  const reset = () => {
    setFiles([]);
    setUploadState("idle");
    setProgress(0);
    setUploadedCount(0);
    setErrorMessage(null);
  };

  // ── Render ───────────────────────────────────────────────────
  if (uploadState === "success") {
    return <SuccessScreen onUploadMore={reset} />;
  }

  return (
    <motion.section
      id="upload-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="max-w-2xl mx-auto px-4 pb-20"
    >
      <div className="glass-card rounded-4xl p-6 sm:p-8 shadow-wedding-lg">
        {/* ── Section Header ── */}
        <div className="text-center mb-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-800 mb-1">
            Share Your Memories
          </h2>
          <p className="font-inter text-sm text-gray-500">
            JPG · PNG · HEIC &nbsp;•&nbsp; Max {weddingConfig.maxUploadSizeMB}MB each
          </p>
        </div>

        {/* ── Drop Zone ── */}
        <AnimatePresence>
          {uploadState === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className={`upload-zone rounded-3xl p-8 sm:p-12 flex flex-col items-center gap-4 cursor-pointer transition-all ${
                  isDragOver ? "drag-over" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => galleryRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload photos — click or drag and drop"
                onKeyDown={(e) => e.key === "Enter" && galleryRef.current?.click()}
              >
                {/* Camera icon */}
                <motion.div
                  animate={isDragOver ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-100 to-blush-100 flex items-center justify-center shadow-card"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M22 10l-2-3H12l-2 3H5a2 2 0 00-2 2v12a2 2 0 002 2h22a2 2 0 002-2V12a2 2 0 00-2-2h-5z" stroke="#C9A84C" strokeWidth="1.8" strokeLinejoin="round" />
                    <circle cx="16" cy="18" r="4.5" stroke="#C9A84C" strokeWidth="1.8" />
                    <circle cx="24" cy="13" r="1" fill="#C9A84C" />
                  </svg>
                </motion.div>

                <div className="text-center">
                  <p className="font-serif text-gray-700 text-lg font-medium">
                    {isDragOver ? "Drop your photos here!" : "Drag & drop photos here"}
                  </p>
                  <p className="font-inter text-gray-400 text-sm mt-1">or choose an option below</p>
                </div>

                {/* Hidden inputs */}
                <input
                  ref={galleryRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/heic,image/heif,image/webp,.heic,.heif"
                  multiple
                  className="hidden"
                  id="gallery-input"
                  onChange={(e) => e.target.files && processFiles(e.target.files)}
                />
                <input
                  ref={cameraRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  id="camera-input"
                  onChange={(e) => e.target.files && processFiles(e.target.files)}
                />
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => galleryRef.current?.click()}
                  id="gallery-btn"
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-cream-100 border border-gold-200 text-gold-700 font-inter font-medium text-sm transition-all hover:bg-gold-50 hover:border-gold-400 hover:shadow-md"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="2" width="14" height="14" rx="2.5" stroke="#C9A84C" strokeWidth="1.5" />
                    <circle cx="6.5" cy="6.5" r="1.5" fill="#C9A84C" />
                    <path d="M2 12l4-4 3 3 2-2 5 5" stroke="#C9A84C" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                  Gallery
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => { e.stopPropagation(); cameraRef.current?.click(); }}
                  id="camera-btn"
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-cream-100 border border-blush-300 text-blush-600 font-inter font-medium text-sm transition-all hover:bg-blush-50 hover:border-blush-400 hover:shadow-md"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M13 6l-1-2H6L5 6H2a1 1 0 00-1 1v7a1 1 0 001 1h14a1 1 0 001-1V7a1 1 0 00-1-1h-3z" stroke="#E8A0B0" strokeWidth="1.5" strokeLinejoin="round" />
                    <circle cx="9" cy="10" r="2.5" stroke="#E8A0B0" strokeWidth="1.5" />
                  </svg>
                  Camera
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Error Banner ── */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 font-inter text-sm whitespace-pre-line"
              role="alert"
            >
              ⚠️ {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Image Previews ── */}
        <AnimatePresence>
          {files.length > 0 && uploadState === "idle" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5"
            >
              <ImagePreview files={files} onRemove={removeFile} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Progress Bar ── */}
        <AnimatePresence>
          {uploadState === "uploading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-5"
            >
              <ProgressBar
                progress={progress}
                uploadedCount={uploadedCount}
                totalCount={files.length}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Upload Error ── */}
        <AnimatePresence>
          {uploadState === "error" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center"
            >
              <p className="text-red-500 font-inter mb-3">Something went wrong. Please try again.</p>
              <button onClick={reset} className="btn-gold px-6 py-2.5 rounded-2xl text-sm">
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Upload Button ── */}
        <AnimatePresence>
          {files.length > 0 && uploadState === "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-5"
            >
              <motion.button
                id="upload-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleUpload}
                disabled={uploadState !== "idle"}
                className="btn-gold w-full py-4 px-6 rounded-2xl font-inter font-semibold text-base tracking-wide shadow-wedding animate-pulse-gold flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3v10M10 3l-3 3M10 3l3 3" stroke="#5C4A08" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 13v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke="#5C4A08" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Upload {files.length} Photo{files.length !== 1 ? "s" : ""}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
