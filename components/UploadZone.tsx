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

// Client-side image compression to bypass Vercel's 4.5MB request limit
// and make uploads 5x faster for guests on mobile data while retaining high quality.
function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    // Skip if it's not a common compressible image, or HEIC (which canvas can't read directly)
    const isCompressible =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png" ||
      file.type === "image/webp";

    if (!isCompressible) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Max resolution: 2500px on the longest side (excellent for prints/screens)
        const MAX_WIDTH = 2500;
        const MAX_HEIGHT = 2500;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              // Only use compressed file if it's actually smaller
              resolve(compressedFile.size < file.size ? compressedFile : file);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.85 // 85% quality is visually indistinguishable but saves ~80% file size
        );
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

const CloudUploadIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
    <path d="M12 10v9M12 10l-3 3M12 10l3 3" />
    <path d="M20.38 7.38A5.5 5.5 0 0 0 16 5.5a5.5 5.5 0 0 0-4.62 2.58A6 6 0 1 0 12 19.5h3" />
  </svg>
);

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
      if (file.size > MAX_BYTES) {
        errors.push(`"${file.name}" exceeds the ${weddingConfig.maxUploadSizeMB}MB limit.`);
        continue;
      }
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
      const selected = files[i];
      
      // Compress the image on the client side before sending to bypass Vercel 4.5MB limit
      let fileToUpload = selected.file;
      try {
        fileToUpload = await compressImage(selected.file);
      } catch (err) {
        console.warn("Compression failed, uploading original file", err);
      }

      const formData = new FormData();
      formData.append("file", fileToUpload);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          failedFiles.push(selected.name);
          console.error("Upload failed for", selected.name, data);
        } else {
          successCount++;
        }
      } catch (err) {
        failedFiles.push(selected.name);
        console.error("Fetch error for", selected.name, err);
      }

      setProgress(Math.round(((i + 1) / total) * 100));
      setUploadedCount(i + 1);
    }

    files.forEach((f) => {
      if (f.preview.startsWith("blob:")) URL.revokeObjectURL(f.preview);
    });

    if (successCount === total) {
      setUploadState("success");
    } else if (successCount > 0) {
      setUploadState("success");
      setErrorMessage(`${failedFiles.length} file(s) failed to upload: ${failedFiles.join(", ")}`);
    } else {
      setUploadState("error");
      setErrorMessage("Upload failed. Please refresh and try again.");
    }
  };

  const reset = () => {
    setFiles([]);
    setUploadState("idle");
    setProgress(0);
    setUploadedCount(0);
    setErrorMessage(null);
  };

  if (uploadState === "success") {
    return <SuccessScreen onUploadMore={reset} />;
  }

  return (
    <motion.section
      id="upload-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
      className="max-w-xl mx-auto px-4 pb-12"
    >
      <div className="bg-[#ede2c2]/35 border border-[#cfc08f]/30 rounded-3xl p-5 sm:p-6 shadow-wedding">
        <AnimatePresence>
          {uploadState === "idle" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className={`border border-[#cfc08f]/40 rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  isDragOver ? "bg-[#C9A84C]/5 border-[#C9A84C]" : "bg-white/40 hover:bg-white/60"
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
                <div className="text-center flex flex-col items-center">
                  <CloudUploadIcon />
                  <p className="font-inter text-slate-600 text-sm font-semibold mt-3">
                    Drag and drop your photos here
                  </p>
                  <p className="font-inter text-slate-400 text-xs mt-1">
                    Supports PNG, JPG, JPEG, HEIC up to {weddingConfig.maxUploadSizeMB}MB
                  </p>
                </div>

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

              <div className="grid grid-cols-2 gap-4 mt-5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => { e.stopPropagation(); cameraRef.current?.click(); }}
                  id="camera-btn"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-[#cfc08f]/20 text-slate-700 font-inter font-medium text-sm transition-all hover:bg-gray-50 shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  Take Photo
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => galleryRef.current?.click()}
                  id="gallery-btn"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-[#cfc08f]/20 text-slate-700 font-inter font-medium text-sm transition-all hover:bg-gray-50 shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Gallery
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 font-inter text-xs flex items-start gap-2 whitespace-pre-line"
              role="alert"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

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

        <AnimatePresence>
          {uploadState === "error" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center"
            >
              <p className="text-red-500 font-inter text-sm mb-3">Something went wrong. Please refresh and try again.</p>
              <button onClick={reset} className="btn-gold px-6 py-2.5 rounded-xl text-sm">
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
                className="btn-gold w-full py-3.5 px-6 rounded-xl font-inter font-semibold text-sm tracking-wide shadow-wedding flex items-center justify-center gap-3"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C4A08" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload {files.length} Photo{files.length !== 1 ? "s" : ""}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {uploadState === "idle" && (
        <div className="mt-8 bg-[#ede2c2]/15 border border-[#cfc08f]/20 rounded-2xl p-5 shadow-sm text-center">
          <h3 className="font-inter text-xs font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-5">
            HOW IT WORKS
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#C9A84C] text-white text-xs font-bold mb-2">
                1
              </span>
              <p className="font-inter text-[11px] font-semibold text-slate-600 leading-tight">
                Snap or select photos
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#C9A84C] text-white text-xs font-bold mb-2">
                2
              </span>
              <p className="font-inter text-[11px] font-semibold text-slate-600 leading-tight">
                Press Upload button
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#C9A84C] text-white text-xs font-bold mb-2">
                3
              </span>
              <p className="font-inter text-[11px] font-semibold text-slate-600 leading-tight">
                Saved to our album!
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
