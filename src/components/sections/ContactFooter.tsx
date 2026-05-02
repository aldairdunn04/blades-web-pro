"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Instagram, MessageSquare, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

function StatusIndicator() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      // Lima is UTC-5
      const limaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Lima" }));
      const day = limaTime.getDay(); // 0 = Sunday
      const hour = limaTime.getHours();

      // Open Mon-Sat (1-6), 10:00 to 21:00
      const isWorkDay = day >= 1 && day <= 6;
      const isWorkingHours = hour >= 10 && hour < 21;
      
      setIsOpen(isWorkDay && isWorkingHours);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn("text-sm font-bold uppercase tracking-widest flex items-center gap-2", isOpen ? "text-green-500" : "text-red-500")}>
      <div className={cn("w-2 h-2 rounded-full animate-pulse", isOpen ? "bg-green-500" : "bg-red-500")} />
      {isOpen ? "Abierto Ahora" : "Cerrado"}
    </div>
  );
}

// Helper for class names since I used it in StatusIndicator
import { cn } from "@/lib/utils";

export function ContactFooter() {
  return (
    <footer className="bg-black py-12 border-t border-white/5">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xl font-black tracking-tighter text-white">
              BLADES <span className="text-primary italic">STUDIO</span>
            </span>
            <span className="text-[10px] text-muted font-bold tracking-widest uppercase">
              MAESTRÍA EN PRECISIÓN — SJL
            </span>
            <StatusIndicator />
          </div>

          <div className="flex gap-4">
            <a 
              href="https://instagram.com/eliott.blades" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all duration-300"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a 
              href="https://wa.me/51998260189" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted hover:text-primary hover:border-primary transition-all duration-300"
            >
              <MessageSquare className="w-5 h-5" />
            </a>
          </div>

          <div className="text-[10px] text-muted tracking-[0.3em] font-bold text-center md:text-right uppercase">
            DISEÑADO POR <span className="text-white hover:text-primary transition-colors cursor-default lowercase tracking-normal">dvnn</span>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-[10px] text-muted font-bold tracking-widest uppercase">
            © 2026 BLADES BARBER STUDIO. TODOS LOS DERECHOS RESERVADOS.
          </p>
        </div>
      </div>
    </footer>
  );
}
