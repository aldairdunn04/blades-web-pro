"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ExternalLink, Calendar } from "lucide-react";
import { Map, MapMarker, MarkerContent, MarkerLabel, MapControls } from "@/components/ui/map";

interface ContactMapProps {
  onOpenBooking?: () => void;
}

export function ContactMap({ onOpenBooking }: ContactMapProps) {
  return (
    <section id="contact" className="py-24 bg-black relative overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Contact Details */}
          <div className="flex flex-col justify-center">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-primary font-black tracking-[0.3em] text-xs uppercase mb-4 block"
              >
                Ubicación y Horarios
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-bold mb-12 tracking-tight"
              >
                VISITA EL <br /> <span className="text-primary italic font-serif">STUDIO</span>
              </motion.h2>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Dirección</h4>
                    <p className="text-muted leading-relaxed">
                      Jr. El Morro A1-4<br />
                      San Juan de Lurigancho, Lima
                    </p>
                    <a 
                      href="https://maps.app.goo.gl/3Syic3pBpNf4Ce927" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary text-sm font-bold mt-2 hover:underline"
                    >
                      CÓMO LLEGAR <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Horarios</h4>
                    <div className="grid grid-cols-2 gap-x-8 text-sm text-muted">
                      <span>Lun - Sáb:</span>
                      <span className="text-white font-medium">10:00 AM - 09:00 PM</span>
                      <span>Domingo:</span>
                      <span className="text-white font-medium italic">Cerrado</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-1">WhatsApp</h4>
                    <p className="text-muted">+51 998 260 189</p>
                    <a 
                      href="https://wa.me/51998260189" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary text-sm font-bold mt-1 hover:underline"
                    >
                      CHATEAR CON ELIOTT <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-12"
              >
                <button 
                  onClick={onOpenBooking}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-black text-sm rounded-sm hover:bg-primary transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  RESERVAR CITA
                </button>
              </motion.div>
            </div>

            {/* Map Visual */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative min-h-[400px] h-full rounded-3xl overflow-hidden border border-white/10 bg-[#111] group"
            >
              <Map
                center={[-76.9765156, -11.9484875]}
                zoom={18}
                scrollZoom={false}
              >
                <MapMarker longitude={-76.9765156} latitude={-11.9484875}>
                  <MarkerContent>
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/40 blur-xl scale-[3] animate-pulse rounded-full" />
                      <div className="relative z-10 w-12 h-12 rounded-full bg-black border-2 border-primary flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </MarkerContent>
                  <MarkerLabel className="bg-black/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg text-xs font-bold text-white uppercase mt-2">
                    BLADES STUDIO
                  </MarkerLabel>
                </MapMarker>
                
                <MapControls 
                  showLocate 
                  showFullscreen 
                  position="top-right"
                  className="top-6 right-6"
                />
              </Map>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
