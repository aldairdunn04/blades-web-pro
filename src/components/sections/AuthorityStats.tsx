"use client";

import { motion } from "framer-motion";
import { Star, Users, MapPin, Award } from "lucide-react";

const stats = [
  {
    label: "MAESTRÍA",
    value: "4.9",
    icon: <Star className="w-4 h-4 text-primary" />,
    description: "Reputación Real",
  },
  {
    label: "EXPERIENCIA",
    value: "400+",
    icon: <Users className="w-4 h-4 text-primary" />,
    description: "Servicios Realizados",
  },
  {
    label: "UBICACIÓN",
    value: "SJL",
    icon: <MapPin className="w-4 h-4 text-primary" />,
    description: "Estudio Central",
  },
  {
    label: "TRAYECTORIA",
    value: "4",
    icon: <Award className="w-4 h-4 text-primary" />,
    description: "Años Perfeccionando",
  },
];

export function AuthorityStats() {
  return (
    <section className="py-12 bg-black border-y border-white/5 relative z-30">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-3 flex items-center gap-2">
                {stat.icon}
                <span className="text-[10px] font-black tracking-[0.3em] text-primary uppercase">
                  {stat.label}
                </span>
              </div>
              <div className="text-3xl md:text-5xl font-black mb-1 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-[10px] text-muted font-bold tracking-widest uppercase">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
