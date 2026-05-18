"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface VideoFrameProps {
  src: string;
  badge: string;
  serviceLabel: string;
  label?: string;
  clipCount?: number;
  onOpenGallery?: () => void;
  onServiceClick?: () => void;
}

export function VideoFrame({
  src,
  badge,
  serviceLabel,
  label = "RAW_FOOTAGE",
  clipCount = 1,
  onOpenGallery,
  onServiceClick,
}: VideoFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { threshold: 0.65 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    const video = videoRef.current;
    setIsHovered(true);
    video?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    setIsHovered(false);
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  const handleOpen = () => {
    if (onOpenGallery) {
      onOpenGallery();
      return;
    }

    onServiceClick?.();
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleOpen}
      role={onOpenGallery || onServiceClick ? "button" : undefined}
      tabIndex={onOpenGallery || onServiceClick ? 0 : undefined}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && (onOpenGallery || onServiceClick)) {
          event.preventDefault();
          handleOpen();
        }
      }}
      className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-950 cursor-pointer select-none"
      style={{
        boxShadow: isHovered
          ? "0 0 0 1px rgba(212,175,55,0.5), 0 8px 40px rgba(212,175,55,0.15)"
          : "0 0 0 1px rgba(255,255,255,0.06)",
        transition: "box-shadow 0.4s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)",
        transform: isHovered ? "scale(1.025)" : "scale(1)",
      }}
    >
      <video
        ref={videoRef}
        src={src}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: isHovered ? "grayscale(0%) brightness(1.05)" : "grayscale(100%) brightness(0.6)",
          transition: "filter 0.65s ease",
        }}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={`Video: ${serviceLabel}`}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isHovered
            ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)",
          transition: "background 0.5s ease",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 150px",
          opacity: isHovered ? 0.5 : 0.25,
          mixBlendMode: "overlay",
          transition: "opacity 0.5s ease",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)",
          opacity: 0.06,
        }}
      />

      <div className="absolute top-4 left-4 z-20">
        <AnimatePresence>
          {isHovered && (
            <motion.div
              key="rec"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[8px] font-black tracking-[0.2em] text-white">REC</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {clipCount > 1 ? (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center gap-1.5 rounded-full border border-primary/35 bg-black/65 px-2.5 py-1 backdrop-blur-md">
            <span className="text-[8px] font-black uppercase tracking-widest text-primary">
              +{clipCount - 1} clips
            </span>
          </div>
        </div>
      ) : (
        <AnimatePresence>
          {isHovered && (
            <motion.div
              key="label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="absolute top-4 right-4 z-20"
            >
              <span
                className="text-[7px] font-mono tracking-wider uppercase"
                style={{ color: "rgba(212,175,55,0.7)" }}
              >
                {label}.MP4
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
        <AnimatePresence>
          {isHovered && (
            <motion.div
              key="divider"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="mb-3 h-px"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)",
                transformOrigin: "center",
              }}
            />
          )}
        </AnimatePresence>

        <div
          className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border"
          style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <span className="text-[8px] font-black tracking-widest text-white uppercase">{badge}</span>
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.button
              key="cta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(event) => {
                event.stopPropagation();
                handleOpen();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold tracking-widest uppercase cursor-pointer border"
              style={{
                backgroundColor: "rgba(212,175,55,0.12)",
                backdropFilter: "blur(12px)",
                borderColor: "rgba(212,175,55,0.35)",
                color: "#D4AF37",
                transition: "background-color 0.2s ease, border-color 0.2s ease",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.backgroundColor = "rgba(212,175,55,0.22)";
                event.currentTarget.style.borderColor = "rgba(212,175,55,0.6)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.backgroundColor = "rgba(212,175,55,0.12)";
                event.currentTarget.style.borderColor = "rgba(212,175,55,0.35)";
              }}
            >
              <span>Ver Servicio</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
