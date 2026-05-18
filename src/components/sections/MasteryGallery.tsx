"use client";

import { useState } from "react";
import { BentoGridItem } from "@/components/ui/bento-grid";
import { ServiceVideoGalleryModal } from "@/components/ui/service-video-gallery-modal";
import { VideoFrame } from "@/components/ui/video-frame";
import { Baby, Droplets, MapPin, Palette, Scissors, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, type Variants } from "framer-motion";
import { services } from "@/data/services";
import type { Service } from "@/types/services";

interface MasteryGalleryProps {
  onOpenCatalog?: (service?: Service) => void;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
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
    videos: [
      "/videos/corte-de-autor.mp4",
      "/videos/corte-de-autor-02.mp4",
      "/videos/corte-de-autor-03.mp4",
      "/videos/corte-de-autor-04.mp4",
    ],
    badge: "100% Precision",
    label: "MASTERY_01",
    serviceId: "corte-maestro",
    serviceLabel: "Corte de Autor",
    icon: <Scissors className="h-4 w-4 text-primary" />,
  },
  {
    title: "Limpieza Facial",
    description: "Cuidado facial profundo. Piel renovada, limpia y preparada con detalle profesional.",
    videos: ["/videos/limpieza-facial.mp4"],
    badge: "Skin Detail",
    label: "MASTERY_02",
    serviceId: "limpieza-facial",
    serviceLabel: "Limpieza Facial Profunda",
    icon: <Droplets className="h-4 w-4 text-primary" />,
  },
  {
    title: "Arte Urbano",
    description: "Streetwear estético. Fade de alto contraste y texturas disruptivas.",
    videos: [
      "/videos/arte-urbano.mp4",
      "/videos/arte-urbano-02.mp4",
      "/videos/arte-urbano-03.mp4",
      "/videos/arte-urbano-04.mp4",
    ],
    badge: "Artistic",
    label: "MASTERY_03",
    serviceId: "diseno-freestyle",
    serviceLabel: "Arte Urbano",
    icon: <Palette className="h-4 w-4 text-primary" />,
  },
  {
    title: "Color",
    description: "Colorimetría premium. Transformaciones precisas con acabado vibrante y control técnico.",
    videos: ["/videos/color.mp4"],
    badge: "Color Work",
    label: "MASTERY_04",
    serviceId: "colorimetria",
    serviceLabel: "Colorimetría Global",
    icon: <Sparkles className="h-4 w-4 text-primary" />,
  },
  {
    title: "Next Gen",
    description: "Nuevas tendencias. Estilo contemporáneo adaptado para líderes del futuro.",
    videos: [
      "/videos/next-gen.mp4",
      "/videos/next-gen-02.mp4",
      "/videos/next-gen-03.mp4",
      "/videos/next-gen-04.mp4",
    ],
    badge: "Kids Specialist",
    label: "MASTERY_05",
    serviceId: "servicio-basico",
    serviceLabel: "Next Gen",
    icon: <Baby className="h-4 w-4 text-primary" />,
  },
  {
    title: "Elite Delivery",
    description: "Servicio premium a domicilio. La experiencia Blades Barber Studio en tu espacio.",
    videos: [
      "/videos/elite-delivery.mp4",
      "/videos/elite-delivery-02.mp4",
      "/videos/elite-delivery-03.mp4",
      "/videos/elite-delivery-04.mp4",
    ],
    badge: "Home Service",
    label: "MASTERY_06",
    serviceId: "delivery-vip",
    serviceLabel: "Elite Delivery",
    icon: <MapPin className="h-4 w-4 text-primary" />,
  },
];

export function MasteryGallery({ onOpenCatalog }: MasteryGalleryProps) {
  const [activeItem, setActiveItem] = useState<(typeof items)[number] | null>(null);

  const handleServiceClick = (item: (typeof items)[number]) => {
    const service = services.find((candidate) => candidate.id === item.serviceId);

    if (service && onOpenCatalog) {
      onOpenCatalog(service);
      return;
    }

    sessionStorage.setItem("preselectedService", item.serviceLabel);

    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="gallery" className="py-32 bg-background relative overflow-hidden">
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

      <div className="hidden md:block max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <motion.div key={item.label} variants={itemVariants} className="h-full">
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
                      src={item.videos[0]}
                      badge={item.badge}
                      serviceLabel={item.serviceLabel}
                      label={item.label}
                      clipCount={item.videos.length}
                      onOpenGallery={() => setActiveItem(item)}
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
          {items.map((item) => (
            <div
              key={item.label}
              className="flex-shrink-0 w-[75vw]"
              style={{ scrollSnapAlign: "center" }}
            >
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
                src={item.videos[0]}
                badge={item.badge}
                serviceLabel={item.serviceLabel}
                label={item.label}
                clipCount={item.videos.length}
                onOpenGallery={() => setActiveItem(item)}
              />
            </div>
          ))}
        </motion.div>

        <div className="flex justify-center gap-2 mt-4">
          {items.map((item) => (
            <div key={item.label} className="w-1 h-1 rounded-full bg-white/20" />
          ))}
        </div>
      </div>

      {activeItem && (
        <ServiceVideoGalleryModal
          isOpen={Boolean(activeItem)}
          title={activeItem.title}
          description={activeItem.description}
          badge={activeItem.badge}
          label={activeItem.label}
          videos={activeItem.videos}
          onClose={() => setActiveItem(null)}
          onReserve={() => handleServiceClick(activeItem)}
        />
      )}

      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent -translate-x-1/2" />
    </section>
  );
}
