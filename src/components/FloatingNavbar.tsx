"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Scissors, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";

interface FloatingNavbarProps {
  onOpenBooking?: () => void;
  isHidden?: boolean;
}

export function FloatingNavbar({ onOpenBooking, isHidden }: FloatingNavbarProps) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, setAuthModalOpen } = useAuth();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setVisible(false);
    } else {
      setVisible(true);
    }
    setScrolled(latest > 50);
  });

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: (visible && !isHidden) ? 0 : -100, 
        opacity: (visible && !isHidden) ? 1 : 0 
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed top-6 inset-x-0 mx-auto w-[95%] md:w-[70%] z-40 px-6 py-3 rounded-full border transition-all duration-300",
        scrolled 
          ? "bg-black/80 backdrop-blur-xl border-white/10 shadow-[0_0_20px_rgba(212,175,55,0.1)]" 
          : "bg-transparent border-transparent"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute -inset-1 bg-primary/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src="/logo-premium.png" className="relative w-8 h-8 md:w-9 md:h-9 object-contain" alt="Blades Logo" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white">BLADES</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-muted">
          <a href="#hero" className="hover:text-primary transition-colors">Inicio</a>
          <a href="#delivery" className="hover:text-primary transition-colors">Delivery</a>
          <a href="#services" className="hover:text-primary transition-colors">Servicios</a>
          <a href="#reputation" className="hover:text-primary transition-colors">Testimonios</a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[9px] text-white/40 uppercase tracking-tighter">Miembro Premium</span>
                <span className="text-[11px] font-bold text-white truncate max-w-[100px]">{user.displayName || user.email}</span>
              </div>
              <button 
                onClick={logout}
                className="p-2 rounded-full border border-white/10 hover:bg-white/5 text-white/50 hover:text-white transition-all"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-[10px] font-bold text-white hover:text-primary transition-colors"
            >
              <UserIcon size={14} />
              <span>INGRESAR</span>
            </button>
          )}

          <button 
            onClick={onOpenBooking}
            className="relative group overflow-hidden bg-primary text-black text-[10px] font-black px-6 py-2.5 rounded-full transition-transform active:scale-95 cursor-pointer"
          >
            <span className="relative z-10">RESERVAR CITA</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>
      </div>
      
    </motion.nav>
  );
}
