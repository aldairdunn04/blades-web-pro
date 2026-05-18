"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceVideoGalleryModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  badge: string;
  label: string;
  videos: string[];
  onClose: () => void;
  onReserve: () => void;
}

export function ServiceVideoGalleryModal({
  isOpen,
  title,
  description,
  badge,
  label,
  videos,
  onClose,
  onReserve,
}: ServiceVideoGalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeVideo = videos[activeIndex] ?? videos[0];

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play().catch(() => {});
  }, [activeIndex, activeVideo, isOpen]);

  const handleReserve = () => {
    onReserve();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/85 px-4 py-5 backdrop-blur-xl md:items-center md:py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Galeria de videos: ${title}`}
            className="relative grid max-h-[94dvh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-white/10 bg-[#070707] shadow-2xl md:max-h-[92vh] md:grid-cols-[minmax(280px,420px)_1fr] md:overflow-hidden"
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white backdrop-blur-md transition-colors hover:border-primary/60 hover:text-primary"
              aria-label="Cerrar galeria"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative mx-auto w-full max-w-[360px] p-4 md:max-w-none md:p-5">
              <div className="relative aspect-[9/16] max-h-[62dvh] overflow-hidden rounded-2xl border border-primary/20 bg-neutral-950 md:max-h-none">
                <video
                  ref={videoRef}
                  key={activeVideo}
                  src={activeVideo}
                  className="absolute inset-0 h-full w-full object-cover"
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20" />
                <div
                  className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)",
                  }}
                />
                <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/65 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md">
                  {badge}
                </div>
                <div className="absolute bottom-4 right-4 rounded-full border border-primary/30 bg-black/65 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-primary backdrop-blur-md">
                  {activeIndex + 1}/{videos.length}
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-col justify-between gap-6 p-5 pt-0 md:overflow-y-auto md:p-8 md:pl-4">
              <div className="space-y-4 pt-1 md:pt-8">
                <span className="text-[10px] font-black uppercase tracking-[0.32em] text-primary">
                  {label}
                </span>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
                    {title}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted md:text-base">
                    {description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {videos.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {videos.map((video, index) => (
                      <button
                        key={`${video}-${index}`}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className={cn(
                          "relative h-24 w-16 shrink-0 overflow-hidden rounded-xl border bg-neutral-950 transition-all md:h-28 md:w-20",
                          activeIndex === index
                            ? "border-primary shadow-[0_0_24px_rgba(212,175,55,0.22)]"
                            : "border-white/10 opacity-70 hover:border-white/30 hover:opacity-100"
                        )}
                        aria-label={`Ver clip ${index + 1} de ${title}`}
                      >
                        <video
                          src={video}
                          className="h-full w-full object-cover grayscale"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <span className="absolute bottom-1 right-1 rounded-full bg-black/75 px-1.5 py-0.5 text-[8px] font-black text-white">
                          {index + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleReserve}
                  className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-4 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-primary md:w-auto"
                >
                  <Calendar className="h-4 w-4" />
                  Reservar este servicio
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
