"use client";

import { motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarStepProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  isCheckingAvailability?: boolean;
}

export function CalendarStep({ selectedDate, onSelectDate, isCheckingAvailability }: CalendarStepProps) {
  // Generate next 14 days, excluding Sundays
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  }).filter(date => date.getDay() !== 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <CalendarIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="text-xl font-serif text-white italic">Fecha de Cita</h4>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Disponibilidad en Tiempo Real</p>
          </div>
        </div>
        {isCheckingAvailability && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20"
          >
            <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Sincronizando</span>
          </motion.div>
        )}
      </div>

      {/* Calendar Scroll — no native scrollbar */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2 snap-x snap-mandatory">
        {days.map((date, idx) => {
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          const isToday = new Date().toDateString() === date.toDateString();
          const isPast = date < today && !isToday;

          return (
            <motion.button
              key={date.toISOString()}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.25 }}
              whileTap={!isPast ? { scale: 0.96 } : {}}
              // Spring bounce on selection
              style={{
                scale: isSelected ? 1.03 : 1,
              }}
              onClick={() => !isPast && onSelectDate(date)}
              disabled={isPast}
              className={cn(
                "flex flex-col items-center min-w-[80px] py-5 px-4 rounded-2xl border snap-start relative overflow-hidden",
                "transition-colors duration-300",
                isPast
                  ? "opacity-30 cursor-not-allowed pointer-events-none bg-white/[0.02] border-white/[0.06]"
                  : isSelected
                    ? "bg-[rgba(212,175,55,0.08)] border-[#D4AF37] text-[#D4AF37]"
                    : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:bg-white/[0.05] hover:border-white/[0.15]"
              )}
            >
              {/* Today indicator dot */}
              {isToday && !isSelected && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}

              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest mb-3",
                isSelected ? "opacity-80" : "opacity-50"
              )}>
                {date.toLocaleDateString('es-PE', { weekday: 'short' }).replace('.', '')}
              </span>

              <span className={cn(
                "text-3xl font-serif italic font-bold leading-none",
                isSelected ? "text-[#D4AF37]" : ""
              )}>
                {date.getDate()}
              </span>

              <span className={cn(
                "text-[8px] font-bold uppercase tracking-widest mt-3",
                isSelected ? "opacity-70" : "opacity-40"
              )}>
                {date.toLocaleDateString('es-PE', { month: 'short' }).replace('.', '')}
              </span>

              {/* Gold shimmer overlay when selected */}
              {isSelected && (
                <motion.div
                  layoutId="calendarGlow"
                  className="absolute inset-0 bg-gradient-to-tr from-[rgba(212,175,55,0.12)] to-transparent pointer-events-none"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Skeleton state */}
      {isCheckingAvailability && (
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              className="skeleton min-w-[80px] h-[104px] rounded-2xl flex-shrink-0"
            />
          ))}
        </div>
      )}
    </div>
  );
}
