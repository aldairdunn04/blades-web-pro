"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Service } from "@/types/services";
import { services as allServices } from "@/data/services";

interface BentoServicesProps {
  onOpenCatalog: (service?: Service) => void;
}

// Mapeo manual de iconos y estilos para el Bento
const bentoDisplayData: Record<string, any> = {
  "servicio-basico": {
    className: "md:col-span-1 md:row-span-1",
    icon: <Zap className="w-5 h-5" />,
    color: "from-blue-500/10 to-cyan-500/10",
    label: "ESENCIAL",
  },
  "servicio-premium": {
    className: "md:col-span-2 md:row-span-2",
    icon: <Star className="w-8 h-8" />,
    color: "from-primary/30 to-primary/5",
    label: "EL MÁS SOLICITADO",
    isLarge: true,
  },
  "servicio-vip": {
    className: "md:col-span-1 md:row-span-1",
    icon: <Crown className="w-5 h-5" />,
    color: "from-purple-500/10 to-pink-500/10",
    label: "LUJO",
  },
  "delivery-vip": {
    className: "md:col-span-2 md:row-span-1",
    icon: <MapPin className="w-5 h-5" />,
    color: "from-orange-500/10 to-red-500/10",
    label: "COMODIDAD TOTAL",
    isWide: true,
  },
};

export function BentoServices({ onOpenCatalog }: BentoServicesProps) {
  const featuredServices = allServices
    .filter(s => bentoDisplayData[s.id])
    .map(s => ({
      ...s,
      ...bentoDisplayData[s.id]
    }));

  return (
    <section id="services" className="py-32 bg-background relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-primary font-black tracking-[0.3em] text-[10px] uppercase mb-4 block"
            >
              Menú de Maestría
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-bold tracking-tighter"
            >
              EXPERIENCIAS <br />
              <span className="text-primary italic">DE ALTO NIVEL</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-muted max-w-sm text-sm leading-relaxed"
          >
            Cada sesión es una maestría de precisión. Seleccionamos los mejores productos y técnicas para garantizar un acabado impecable.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-3 gap-6 mb-16">
          {featuredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onOpenCatalog(service)}
              className={cn(
                "group relative rounded-3xl border border-white/5 bg-surface p-8 overflow-hidden cursor-pointer transition-all duration-500 hover:border-primary/30",
                service.className
              )}
            >
              {/* Glow effect */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                service.color
              )} />

              <div className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "p-3 rounded-2xl bg-white/5 border border-white/10 text-primary",
                    service.isLarge && "p-4"
                  )}>
                    {service.icon}
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-primary opacity-60">
                    {service.label}
                  </span>
                </div>

                <div className="mt-auto">
                  <h3 className={cn(
                    "font-bold tracking-tighter uppercase mb-2 transition-transform group-hover:-translate-y-1 duration-300",
                    service.isLarge ? "text-4xl md:text-6xl" : "text-2xl"
                  )}>
                    {service.name.replace(" (Combo)", "").replace(" Master", "")}
                  </h3>
                  
                  {service.isLarge && (
                    <p className="text-muted text-sm mb-6 max-w-md line-clamp-2">
                      {service.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className={cn(
                        "font-black text-white tracking-tighter",
                        service.isLarge ? "text-5xl" : "text-3xl"
                      )}>
                        S/ {service.price}
                      </span>
                      <span className="text-[10px] text-white/20 font-black tracking-widest uppercase">/ Sesión</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-300">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative stripes for large card */}
              {service.isLarge && (
                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none translate-x-1/2 -translate-y-1/2">
                  <div className="w-full h-full rotate-45 border-r border-b border-primary" />
                </div>
              )}
            </motion.div>
          ))}

          {/* View All Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => onOpenCatalog()}
            className="md:col-span-1 md:row-span-1 group relative rounded-3xl border border-white/5 bg-primary p-8 overflow-hidden cursor-pointer flex flex-col justify-center items-center text-center transition-all duration-500 hover:scale-[0.98]"
          >
            <div className="relative z-10">
              <span className="text-[10px] font-black tracking-[0.3em] text-black/60 uppercase mb-2 block">Explorar</span>
              <h3 className="text-3xl font-black text-black tracking-tighter uppercase mb-4">Ver Todos</h3>
              <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <ChevronRight className="w-6 h-6 text-black" />
              </div>
            </div>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
