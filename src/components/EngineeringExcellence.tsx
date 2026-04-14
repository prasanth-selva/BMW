"use client";

import { motion } from "framer-motion";

export default function EngineeringExcellence() {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax attachment */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/gallery/4k-bmw-m4-gts-orange-9lyk452z7sazaa18.webp')" }}
      />
      {/* Dark Overlay for seamless blending into #050505 */}
      <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-[#050505] via-black/20 to-[#050505]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[#0066b1] font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-4"
        >
          Design Philosophy
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white mb-6"
        >
          Born on the Track.
          <br className="hidden md:block" />
          <span className="md:hidden"> </span>
          Built for the Street.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-lg text-white/70 max-w-2xl font-light"
        >
          A seamless transition from pure adrenaline to refined engineering. The M Series embodies decades of motorsports heritage, distilled into a form that commands attention at every standstill.
        </motion.p>
      </div>
    </section>
  );
}
