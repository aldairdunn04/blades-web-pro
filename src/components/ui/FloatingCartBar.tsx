'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Clock, ChevronRight, Zap } from 'lucide-react';
import { useCart } from '@/lib/contexts/CartContext';
import { Button } from './button';

interface FloatingCartBarProps {
  onContinue: () => void;
}

export function FloatingCartBar({ onContinue }: FloatingCartBarProps) {
  const { selectedServices, totalPrice, totalDuration } = useCart();

  // No mostramos nada si no hay servicios
  if (selectedServices.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, x: '-50%' }}
        animate={{ y: 0, opacity: 1, x: '-50%' }}
        exit={{ y: 100, opacity: 0, x: '-50%' }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-8 left-1/2 z-[110] w-[90%] max-w-xl"
      >
        <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-2 pr-2 pl-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
          {/* Luxury background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between gap-6 relative z-10 py-2">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={selectedServices.length}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      {selectedServices.length} {selectedServices.length === 1 ? 'Servicio' : 'Servicios'}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={totalPrice}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="text-2xl font-serif italic text-white tracking-tight"
                    >
                      S/ {totalPrice}
                    </motion.span>
                  </AnimatePresence>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/40 font-bold">
                    <Clock className="w-3 h-3 text-primary/50" />
                    <span>{totalDuration} min</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={onContinue}
              className="group/btn relative h-14 px-10 rounded-2xl bg-primary text-black font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 overflow-hidden transition-transform active:scale-95 shadow-xl shadow-primary/20"
            >
              <span className="relative z-10">Agendar Cita</span>
              <ChevronRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
