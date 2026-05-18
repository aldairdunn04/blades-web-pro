"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Truck, Clock, ShieldCheck, MapPin, Sparkles, ChevronRight } from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Logística Premium",
    description: "Transformamos tu espacio en un estudio de alto nivel. Llevamos todo: iluminación profesional y herramientas esterilizadas de grado médico.",
    size: "large",
    accent: "bg-primary/20"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Tiempo Optimizado",
    description: "Tu agenda es prioridad. Sin esperas ni desplazamientos, el estudio llega a ti.",
    size: "small",
    accent: "bg-white/5"
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Protocolo Clínico",
    description: "Desinfección profunda tras cada servicio. Seguridad garantizada.",
    size: "small",
    accent: "bg-white/5"
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Cobertura SJL",
    description: "Dominamos la zona con puntualidad milimétrica. Maestría local a tu disposición.",
    size: "large",
    accent: "bg-primary/20"
  }
];

function AdvantageCard({ feature, index }: { feature: any, index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightColor = feature.size === "large" 
    ? "rgba(212, 175, 55, 0.15)" 
    : "rgba(255, 255, 255, 0.05)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        delay: index * 0.1, 
        duration: 1, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      onMouseMove={handleMouseMove}
      className={`group relative p-10 rounded-3xl bg-[#0A0A0A] border border-white/5 backdrop-blur-3xl overflow-hidden flex flex-col justify-between min-h-[320px] transition-all duration-500 hover:border-primary/20 ${
        feature.size === "large" ? "md:col-span-2" : "md:col-span-1"
      }`}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useSpring(
            useTransform(
              [mouseX, mouseY] as any,
              ([x, y]: [number, number]) => `radial-gradient(600px circle at ${x}px ${y}px, ${spotlightColor}, transparent 40%)`
            )
          )
        }}
      />

      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-2xl ${feature.accent} flex items-center justify-center text-primary mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 border border-white/5`}>
          {feature.icon}
        </div>
        <h4 className="text-2xl font-bold mb-4 tracking-tighter group-hover:text-primary transition-colors duration-300">
          {feature.title}
        </h4>
        <p className="text-muted/70 leading-relaxed text-base font-light">
          {feature.description}
        </p>
      </div>
      
      <div className="relative z-10 mt-8 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 uppercase">
        Ver Detalles <ChevronRight className="w-3 h-3" />
      </div>

      {/* Decorative background number or icon */}
      <div className="absolute -bottom-4 -right-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none">
        {feature.icon && <div className="scale-[5] rotate-12">{feature.icon}</div>}
      </div>
    </motion.div>
  );
}

export function DeliveryAdvantage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section 
      id="delivery" 
      ref={containerRef}
      className="py-32 bg-[#050505] relative overflow-hidden"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,55,0.05),transparent_70%)]" />
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -translate-x-1/2 opacity-50" />
      </div>

      <div className="container px-6 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          {/* Content Layer */}
          <div className="lg:col-span-5 lg:sticky lg:top-40">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">Premium Delivery</span>
              </div>

              <h2 className="text-6xl md:text-8xl font-black mb-8 leading-[0.85] tracking-tighter uppercase">
                Maestría <br /> 
                <span className="font-serif italic text-primary lowercase tracking-normal">en movimiento</span>
              </h2>

              <p className="text-muted/80 text-xl leading-relaxed font-light max-w-md">
                Redefinimos la barbería convencional. No es solo un corte a domicilio; es un <span className="text-white font-medium italic">estudio de autor</span> itinerante, diseñado para hombres que exigen excelencia sin comprometer su tiempo.
              </p>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-12">
                <div>
                  <div className="text-4xl font-bold text-white mb-2 tabular-nums">100%</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-black">Personalizado</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-2">SJL</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-black">Operación Central</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual Grid Layer */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <AdvantageCard key={idx} feature={feature} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
