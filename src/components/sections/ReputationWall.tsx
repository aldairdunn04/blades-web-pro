"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Star, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Excelente servicio, muy detallista y profesional. El mejor corte que he tenido en SJL.",
    name: "Juan Pérez",
    title: "Cliente Local"
  },
  {
    quote: "La atención personalizada y el servicio de ozonoterapia es de otro nivel. Muy recomendado.",
    name: "Carlos Ruiz",
    title: "Cliente Premium"
  },
  {
    quote: "Me encanta la comodidad del servicio a domicilio. Eliott es un maestro con la navaja.",
    name: "Mateo Silva",
    title: "Cliente Delivery"
  },
  {
    quote: "Un espacio increíble y profesionalismo al 100%. Eliott entiende exactamente lo que pides.",
    name: "Diego Torres",
    title: "Cliente V.I.P"
  },
  {
    quote: "Puntualidad y limpieza impecable. No cambio a Blades por nada.",
    name: "Luis Navarro",
    title: "Cliente Habitual"
  }
];

export function ReputationWall() {
  return (
    <section id="reputation" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full translate-y-1/2 pointer-events-none" />
      
      <div className="container px-4 mx-auto mb-12 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <span className="text-primary font-black tracking-[0.3em] text-[10px] uppercase mb-4 block">
            Testimonios Reales
          </span>
          
          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>

          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none mb-6">
            CONFIADO POR <br />
            <span className="text-primary italic">NUESTROS CLIENTES</span>
          </h2>
          
          <p className="text-muted max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            Más de <span className="text-white font-bold">400 clientes</span> con una calificación real de <span className="text-primary font-bold">4.9 estrellas</span>. 
            Gente real, resultados reales, maestría pura en cada corte.
          </p>
        </motion.div>
      </div>
      
      <div className="flex flex-col antialiased items-center justify-center relative overflow-hidden">
        <InfiniteMovingCards
          items={testimonials}
          direction="right"
          speed="slow"
          className="py-4"
        />
      </div>

      {/* Trust Badges or Meta Info */}
      <div className="container px-4 mx-auto mt-12 relative z-10">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter">GOOGLE</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-white" />)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tighter">INSTAGRAM</span>
            <span className="text-sm font-bold tracking-tighter">@BLADESBARBER</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
            <ShieldCheck className="w-3 h-3 text-primary" />
            <span className="text-[8px] font-black text-primary tracking-widest uppercase">100% VERIFICADO</span>
          </div>
        </div>
      </div>
    </section>
  );
}
