"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroProps {
  onOpenBooking: () => void;
}

export function Hero({ onOpenBooking }: HeroProps) {
  const line1 = "MAESTRÍA EN";
  const line2 = "PRECISIÓN";
  
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* Background with Cinematic Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-10 opacity-80" />
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
          className="h-full w-full bg-[url('/assets/hero.png')] bg-cover bg-center"
        />
        {/* Animated Dust/Noise Overlay */}
        <div className="absolute inset-0 z-15 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>
      
      <div className="container relative z-20 text-center px-4 max-w-5xl">
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-[1px] w-8 md:w-12 bg-primary/40" />
            <span className="font-cormorant italic text-xl md:text-3xl text-primary tracking-[0.4em] uppercase">
              {line1}
            </span>
            <div className="h-[1px] w-8 md:w-12 bg-primary/40" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="text-[12vw] md:text-[9rem] font-medium tracking-tight leading-[0.9] text-white mb-10 select-none"
            style={{ 
              textShadow: "0 0 50px rgba(212, 175, 55, 0.1)",
            }}
          >
            {line2}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="text-[10px] md:text-xs text-muted/60 max-w-md mx-auto mb-16 font-medium tracking-[0.4em] uppercase leading-relaxed"
          >
            EL ESTÁNDAR MÁS ALTO DE BARBERÍA EN SJL. <br />
            LIDERADA POR <span className="text-primary font-bold italic tracking-normal">ELIOTT BLADES</span>.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <button 
              onClick={onOpenBooking}
              className="group relative inline-flex items-center justify-center px-16 py-6 bg-white/[0.03] backdrop-blur-sm border border-white/10 text-white transition-all duration-700 overflow-hidden rounded-full hover:border-primary/40 cursor-pointer"
            >
              {/* Gold Glow */}
              <div className="absolute inset-0 bg-primary/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Inner Border Animation */}
              <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 rounded-full transition-all duration-700" />
              
              <span className="relative z-10 text-[9px] md:text-[10px] font-black tracking-[0.6em] group-hover:text-primary transition-colors duration-500 uppercase flex items-center gap-4">
                RESERVAR EXPERIENCIA
              </span>
              
              {/* Light Sweep */}
              <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:left-[100%] transition-all duration-1500 ease-in-out" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
      >
        <span className="text-[9px] font-bold tracking-[0.6em] text-muted/30 uppercase rotate-90 origin-center mb-8">
          DESCUBRE
        </span>
        <div className="relative w-[1px] h-16 bg-white/5 overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-primary/50 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
