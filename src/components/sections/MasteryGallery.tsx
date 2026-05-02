"use client";

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { VideoFrame } from "@/components/ui/video-frame";
import { Scissors, Baby, Palette, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Variants para staggered reveal al hacer scroll
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const items = [
  {
    title: "Corte de Autor",
    description: "Precisión arquitectónica. Diseños esculpidos a medida para tu estructura facial.",
    videoSrc: "/videos/corte-de-autor.mp4",
    badge: "100% Precision",
    label: "MASTERY_01",
    serviceLabel: "Corte de Autor",
    icon: <Scissors className="h-4 w-4 text-primary" />,
  },
  {
    title: "Arte Urbano",
    description: "Streetwear estético. Fade de alto contraste y texturas disruptivas.",
    videoSrc: "/videos/arte-urbano.mp4",
    badge: "Artistic",
    label: "MASTERY_02",
    serviceLabel: "Arte Urbano",
    icon: <Palette className="h-4 w-4 text-primary" />,
  },
  {
    title: "Next Gen",
    description: "Nuevas tendencias. Estilo contemporáneo adaptado para líderes del futuro.",
    videoSrc: "/videos/next-gen.mp4",
    badge: "Kids Specialist",
    label: "MASTERY_03",
    serviceLabel: "Next Gen",
    icon: <Baby className="h-4 w-4 text-primary" />,
  },
  {
    title: "Elite Delivery",
    description: "Servicio premium a domicilio. La experiencia Blades Studio en tu espacio.",
    videoSrc: "/videos/elite-delivery.mp4",
    badge: "Home Service",
    label: "MASTERY_04",
    serviceLabel: "Elite Delivery",
    icon: <MapPin className="h-4 w-4 text-primary" />,
  },
];

export function MasteryGallery() {
  const handleServiceClick = (serviceLabel: string) => {
    // Guardamos el servicio en sessionStorage para que el formulario de Booking lo preseleccione
    sessionStorage.setItem("preselectedService", serviceLabel);
    
    // Scroll suave hacia la sección de booking
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="gallery" className="py-32 bg-background relative overflow-hidden">
      {/* Header section — conservado del diseño original */}
      <div className="container px-4 mx-auto mb-20 relative z-10">
        <div className="max-w-2xl">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-primary font-black tracking-[0.3em] text-[10px] uppercase mb-4 block"
          >
            Portafolio de Resultados
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-bold tracking-tighter leading-none mb-8"
          >
            GALERÍA DE <br />
            <span className="text-primary italic">MAESTRÍA</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-lg leading-relaxed"
          >
            Cada corte es una obra. No solo cortamos cabello, definimos identidades.
          </motion.p>
        </div>
      </div>

      {/* Desktop: Grid con VideoFrames */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants as any}
                className="h-full"
              >
                <BentoGridItem
                  title={
                    <span className="text-xl font-bold tracking-tighter uppercase">
                      {item.title}
                    </span>
                  }
                  description={
                    <span className="text-xs text-muted leading-relaxed">
                      {item.description}
                    </span>
                  }
                  header={
                    <VideoFrame
                      src={item.videoSrc}
                      badge={item.badge}
                      serviceLabel={item.serviceLabel}
                      label={item.label}
                      onServiceClick={() => handleServiceClick(item.serviceLabel)}
                    />
                  }
                  className={cn(
                    "group/item h-full transition-all duration-500 border-white/5 bg-surface/50 backdrop-blur-sm"
                  )}
                  icon={item.icon}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile: Carousel horizontal con scroll snap */}
      <div className="md:hidden px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex gap-4 overflow-x-auto pb-4"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[75vw]"
              style={{ scrollSnapAlign: "center" }}
            >
              {/* Card info */}
              <div className="flex items-center gap-2 mb-3">
                {item.icon}
                <div>
                  <p className="text-sm font-bold tracking-tighter uppercase text-foreground">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-muted">{item.description}</p>
                </div>
              </div>
              <VideoFrame
                src={item.videoSrc}
                badge={item.badge}
                serviceLabel={item.serviceLabel}
                label={item.label}
                onServiceClick={() => handleServiceClick(item.serviceLabel)}
              />
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full bg-white/20"
            />
          ))}
        </div>
      </div>

      {/* Decorative vertical line — conservada del diseño original */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent -translate-x-1/2" />
    </section>
  );
}
