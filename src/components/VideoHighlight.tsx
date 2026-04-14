"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function VideoHighlight() {
  return (
    <section className="relative w-full h-[80vh] md:h-screen bg-black overflow-hidden flex flex-col justify-end">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-70"
        src="/videos/videoplayback.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-32 flex flex-col items-start gap-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-2"
        >
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-white/90">Pure Adrenaline</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-[0.9]"
        >
          Built to push boundaries.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="max-w-xl text-lg text-white/70 mt-2"
        >
          From the roaring twin-power turbo engine to the razor-sharp aerodynamic profile, every aspect of the M4 is calibrated for absolute dominance.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="mt-6 flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-semibold uppercase tracking-wider text-sm transition-transform hover:scale-105"
        >
          <span>Watch the Film</span>
        </motion.button>
      </div>
    </section>
  );
}
