"use client";

import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlotStepProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  occupiedSlots?: string[];
  isCheckingAvailability?: boolean;
}

// Check icon — 12x12 SVG inline, no external lib
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="inline-block ml-1.5 flex-shrink-0">
      <path
        d="M2 6L5 9L10 3"
        stroke="#D4AF37"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Framer Motion cascade variants
const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.03 },
  },
};

const slotVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export function TimeSlotStep({
  selectedDate,
  selectedTime,
  onSelectTime,
  occupiedSlots = [],
  isCheckingAvailability = false,
}: TimeSlotStepProps) {
  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "01:00 PM", "03:00 PM", "04:00 PM",
    "05:00 PM", "06:00 PM", "07:00 PM",
    "08:00 PM",
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
          <Clock className="w-5 h-5 text-primary" />
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
          Horarios Disponibles
        </h4>
      </div>

      {/* Loading skeleton */}
      {isCheckingAvailability ? (
        <div className="grid grid-cols-3 gap-2.5">
          {Array.from({ length: 9 }).map((_, idx) => (
            <div
              key={idx}
              className="skeleton h-[46px] rounded-xl"
            />
          ))}
        </div>
      ) : (
        /* Cascade animated grid */
        <motion.div
          className="grid grid-cols-3 gap-2.5"
          variants={gridVariants}
          initial="hidden"
          animate="show"
        >
          {timeSlots.map((time) => {
            const isSelected = selectedTime === time;
            
            // Validate if the time is in the past for today
            const isToday = selectedDate && new Date().toDateString() === selectedDate.toDateString();
            let isPast = false;
            
            if (isToday) {
              const now = new Date();
              const [timeStr, modifier] = time.split(' ');
              let [hours, minutes] = timeStr.split(':').map(Number);
              
              if (hours === 12) {
                hours = modifier === 'AM' ? 0 : 12;
              } else if (modifier === 'PM') {
                hours += 12;
              }
              
              const slotTime = new Date();
              slotTime.setHours(hours, minutes, 0, 0);
              
              // Block if current time is after slot time
              isPast = now > slotTime;
            }

            // Normalize and check occupancy
            const normalizeTime = (t: string) => t.toLowerCase().replace(/\s+/g, '').trim();
            const normalizedTime = normalizeTime(time);
            
            const isOccupied = occupiedSlots.some(s => normalizeTime(String(s)) === normalizedTime) || isPast;

            if (isSelected && isOccupied) {
              console.log(`Slot ${time} is occupied/past. Occupied:`, occupiedSlots, "Past:", isPast);
            }

            return (
              <motion.button
                key={time}
                variants={slotVariants}
                onClick={() => !isOccupied && onSelectTime(time)}
                disabled={isOccupied}
                aria-pressed={isSelected}
                aria-disabled={isOccupied}
                aria-label={isOccupied ? `${time} — Horario no disponible` : time}
                className={cn(
                  "group relative flex items-center justify-center gap-0.5 py-3.5 px-3 rounded-xl border text-[11px] font-black tracking-tight overflow-hidden",
                  "transition-colors duration-200",
                  isOccupied
                    ? "border-white/[0.05] text-white/20 cursor-not-allowed"
                    : isSelected
                      ? "border-[#D4AF37] bg-[rgba(212,175,55,0.1)] text-[#D4AF37]"
                      : "border-white/[0.08] text-white/60 hover:border-white/30 hover:text-white/90 hover:bg-white/[0.04]"
                )}
              >
                {/* Time label */}
                <span className="relative z-10">{time}</span>

                {/* Check icon when selected */}
                {isSelected && !isOccupied && <CheckIcon />}

                {/* Selected: gold shimmer */}
                {isSelected && !isOccupied && (
                  <motion.div
                    layoutId="timeGlow"
                    className="absolute inset-0 bg-gradient-to-tr from-[rgba(212,175,55,0.08)] to-transparent pointer-events-none"
                  />
                )}

                {/* Occupied: diagonal line SVG overlay */}
                {isOccupied && (
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <line
                      x1="0"
                      y1="100%"
                      x2="100%"
                      y2="0"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="1"
                    />
                  </svg>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      )}

      <p className="text-[9px] text-white/10 italic text-center mt-2 uppercase tracking-[0.2em]">
        * Sujeto a confirmación inmediata vía WhatsApp
      </p>
    </div>
  );
}
