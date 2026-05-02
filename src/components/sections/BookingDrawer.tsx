"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Service } from "@/types/services";
import { BookingFlow } from "@/components/ui/booking-flow";

interface BookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServices: Service[];
}

export function BookingDrawer({ isOpen, onClose, selectedServices }: BookingDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-[101] w-full max-w-xl bg-[#080808] border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
            {/* Grain Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[url('/noise.svg')]" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-8 border-b border-white/[0.03] bg-white/[0.01]">
              <div>
                <h3 className="text-white font-serif text-3xl tracking-tighter italic">La Experiencia</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                  <p className="text-[10px] text-primary font-black tracking-[0.2em] uppercase">
                    Configura tu Experiencia
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative z-10">
              <BookingFlow 
                services={selectedServices} 
                isOpen={true} 
                onClose={onClose} 
              />
            </div>

            {/* Subtle Footer Decor */}
            <div className="p-4 border-t border-white/[0.02] bg-black text-center">
              <p className="text-[8px] text-white/10 uppercase tracking-[0.5em] font-bold">
                Elite Grooming Experience • SJL
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
