"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Scissors, User, Sparkles, Palette, Truck, Zap, Clock, ChevronRight } from "lucide-react";
import { services } from "@/data/services";
import { Service, ServiceCategory } from "@/types/services";
import { cn } from "@/lib/utils";
import { BookingFlow } from "@/components/ui/booking-flow";

import { useCart } from "@/lib/contexts/CartContext";
import { FloatingCartBar } from "@/components/ui/FloatingCartBar";

interface ServicesCatalogOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: Service | null;
}

const categoryIcons: Record<ServiceCategory, any> = {
  "Barbería": Scissors,
  "Barba & Rostro": User,
  "Cuidado Facial": Sparkles,
  "Color & Tratamientos": Palette,
  "VIP Delivery": Truck,
};

export function ServicesCatalogOverlay({ isOpen, onClose, initialService }: ServicesCatalogOverlayProps) {
  const { selectedServices, addService, removeService } = useCart();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("Barbería");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialService) {
      addService(initialService);
    }
  }, [isOpen, initialService, addService]);

  const categories: ServiceCategory[] = [
    "Barbería",
    "Barba & Rostro",
    "Cuidado Facial",
    "Color & Tratamientos",
    "VIP Delivery",
  ];

  // Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some(s => s.id === serviceId);
  };

  const handleToggleService = (service: Service) => {
    if (isServiceSelected(service.id)) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  const scrollToCategory = (category: ServiceCategory) => {
    const element = document.getElementById(`category-${category}`);
    if (element && scrollContainerRef.current) {
      const offset = 220; // Header + Navigation height
      const bodyRect = scrollContainerRef.current.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition + scrollContainerRef.current.scrollTop - offset;

      scrollContainerRef.current.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveCategory(category);
    }
  };

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#050505] flex flex-col selection:bg-primary selection:text-black overflow-hidden"
        >
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </div>

          {/* Header - Fixed at top with editorial style */}
          <div className="flex-none z-50 bg-[#050505] border-b border-white/5 pt-8 pb-4">
            <div className="container mx-auto px-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col gap-1">
                  <span className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase mb-1">
                    Eliott Blades Studio
                  </span>
                  <h2 className="text-4xl md:text-6xl font-serif italic text-white tracking-tight leading-tight">
                    Catálogo de Maestría
                  </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="group relative w-12 h-12 flex items-center justify-center rounded-full border border-white/10 hover:border-primary/50 transition-all duration-500"
                >
                  <X className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold tracking-[0.2em] text-white/20 group-hover:text-primary/40 opacity-0 group-hover:opacity-100 transition-all uppercase">Cerrar</span>
                </button>
              </div>

              {/* Sticky Category Navigation */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => scrollToCategory(category)}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border shrink-0",
                      activeCategory === category
                        ? "bg-primary text-black border-primary shadow-lg shadow-primary/20 scale-105"
                        : "bg-white/5 text-white/40 border-white/5 hover:border-primary/30 hover:text-white"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto relative custom-scrollbar scroll-smooth"
          >
            <div className="container mx-auto px-6 py-20 pb-64">
              <div className="max-w-5xl mx-auto space-y-32">
                {categories.map((category) => {
                  const Icon = categoryIcons[category];
                  const categoryServices = services.filter(s => s.category === category);
                  
                  if (categoryServices.length === 0) return null;

                  return (
                    <div 
                      key={category} 
                      id={`category-${category}`}
                      className="space-y-16"
                    >
                      {/* Category Header */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <h3 className="text-3xl md:text-4xl font-serif text-white tracking-tight italic">
                            {category}
                          </h3>
                        </div>
                        <div className="h-px w-full bg-gradient-to-r from-primary/40 via-primary/10 to-transparent" />
                      </div>

                      {/* Services List - Premium Grid */}
                      <div className="grid gap-6">
                        {categoryServices.map((service, index) => {
                          const isSelected = isServiceSelected(service.id);
                          return (
                            <motion.div 
                              key={service.id}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.05 }}
                              className={cn(
                                "group relative p-6 rounded-3xl transition-all duration-500 border overflow-hidden",
                                isSelected 
                                  ? "bg-primary/[0.03] border-primary/30 shadow-[0_0_40px_rgba(212,175,55,0.05)]" 
                                  : "bg-white/[0.02] border-white/5 hover:border-primary/20 hover:bg-white/[0.04]"
                              )}
                            >
                              {/* Selection Indicator */}
                              <div className={cn(
                                "absolute left-0 top-0 bottom-0 w-1 bg-primary transition-transform duration-500",
                                isSelected ? "scale-y-100" : "scale-y-0 group-hover:scale-y-50"
                              )} />

                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="flex-1 space-y-4">
                                  <div className="flex items-center gap-4">
                                    <h4 className={cn(
                                      "text-xl font-bold transition-colors tracking-tight",
                                      isSelected ? "text-primary" : "text-white group-hover:text-primary"
                                    )}>
                                      {service.name}
                                    </h4>
                                    {service.featured && (
                                      <span className="flex items-center gap-1.5 bg-primary/10 text-primary text-[8px] font-black px-2.5 py-1 rounded-full border border-primary/20 tracking-[0.2em] uppercase">
                                        <Sparkles className="w-3 h-3" />
                                        VIP
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-white/50 leading-relaxed max-w-2xl font-light">
                                    {service.description}
                                  </p>
                                  <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                      <Clock className="w-3.5 h-3.5 text-primary/50" />
                                      {service.duration}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                      <Zap className="w-3.5 h-3.5 text-primary/50" />
                                      Resultado Top
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-6 md:gap-10 shrink-0">
                                  <div className="flex flex-col items-end">
                                    <span className="text-3xl font-serif text-white italic">
                                      S/ {service.price}
                                    </span>
                                    <span className="text-[8px] text-primary font-bold uppercase tracking-widest mt-1">Precio Final</span>
                                  </div>
                                  
                                  <button 
                                    onClick={() => handleToggleService(service)}
                                    className={cn(
                                      "group/btn relative h-14 px-8 rounded-2xl transition-all duration-500 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 overflow-hidden",
                                      isSelected 
                                        ? "bg-primary text-black scale-105 shadow-xl shadow-primary/20" 
                                        : "bg-white/5 text-white/60 hover:bg-primary hover:text-black border border-white/5 hover:border-primary"
                                    )}
                                  >
                                    <span className="relative z-10">{isSelected ? "Seleccionado" : "Añadir"}</span>
                                    {isSelected ? <Zap className="w-4 h-4 fill-current relative z-10" /> : <ChevronRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />}
                                    {!isSelected && (
                                      <div className="absolute inset-0 bg-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Editorial Quote */}
                <div className="pt-20 text-center">
                  <div className="inline-flex flex-col items-center gap-8 max-w-xl mx-auto">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Scissors className="w-8 h-8 text-primary" />
                    </div>
                    <blockquote className="text-2xl font-serif italic text-white/80 leading-relaxed">
                      "La barbería no es solo un servicio, es una declaración de intenciones. Cada detalle cuenta una historia de maestría y precisión."
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <div className="h-px w-8 bg-primary/30" />
                      <span className="text-[10px] font-bold tracking-[0.4em] text-primary uppercase">Eliott Blades</span>
                      <div className="h-px w-8 bg-primary/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Cart Bar - Fixed inside the overlay container */}
          <FloatingCartBar onContinue={() => setIsBookingOpen(true)} />
        </motion.div>
      )}
    </AnimatePresence>

    <BookingFlow 
      services={selectedServices}
      isOpen={isBookingOpen}
      onClose={() => setIsBookingOpen(false)}
    />
    </>
  );
}
