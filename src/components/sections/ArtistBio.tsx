"use client";

import { motion } from "framer-motion";

export function ArtistBio() {
  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 relative order-2 md:order-1">
             <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="absolute -inset-4 border border-primary/20 rounded-2xl" />
              <img 
                src="/assets/eliot-portrait.jpeg" 
                alt="Eliot Cervantes" 
                className="relative z-10 w-full rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
          </div>
          
          <div className="flex-1 order-1 md:order-2">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-primary font-black tracking-[0.3em] text-[10px] uppercase mb-6 block"
            >
              El Artista
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter"
            >
              ELIOTT <br /> <span className="text-primary italic">BLADES</span>
            </motion.h2>
            <div className="space-y-6 text-muted text-lg leading-relaxed max-w-xl">
              <p>
                Con años de dedicación perfeccionando el arte de la barbería, Eliott ha transformado Blades en un santuario para aquellos que buscan más que un corte: buscan identidad.
              </p>
              <p>
                Cada trazo de la navaja es una declaración de precisión. Especialista en diseños urbanos complejos y experiencias VIP de cuidado facial, Eliott fusiona la tradición de la vieja escuela con la vanguardia de Lima.
              </p>
              <p className="text-white font-bold italic border-l-2 border-primary pl-6 py-2">
                "No solo cortamos cabello; esculpimos la confianza que el cliente lleva al mundo."
              </p>
            </div>
            
            <div className="mt-12 flex gap-8">
               <div>
                  <div className="text-3xl font-bold text-white">5</div>
                  <div className="text-[10px] text-primary font-black tracking-widest">AÑOS EXP.</div>
               </div>
               <div>
                  <div className="text-3xl font-bold text-white">5.0</div>
                  <div className="text-[10px] text-primary font-black tracking-widest">CALIFICACIÓN</div>
               </div>
               <div>
                  <div className="text-3xl font-bold text-white">400+</div>
                  <div className="text-[10px] text-primary font-black tracking-widest">CORTES REALIZADOS</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
