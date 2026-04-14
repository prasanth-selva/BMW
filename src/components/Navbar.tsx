"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Listen for custom events dispatched by the landing gate
    const handleMusicStarted = () => setIsPlaying(true);
    window.addEventListener("music-started", handleMusicStarted);
    return () => window.removeEventListener("music-started", handleMusicStarted);
  }, []);

  const toggleMusic = () => {
    const audioEl = document.getElementById("bg-music") as HTMLAudioElement;
    if (!audioEl) return;

    if (isPlaying) {
      audioEl.pause();
      setIsPlaying(false);
    } else {
      audioEl.volume = 0.5;
      audioEl.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.error("Audio playback failed:", e);
      });
    }
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-6 flex items-center justify-between pointer-events-none"
    >
      <div className="flex items-center gap-2 pointer-events-auto">
        <span className="text-white font-bold text-2xl tracking-tighter uppercase drop-shadow-md">BMW</span>
        <span className="text-white/70 font-light text-sm tracking-widest hidden md:inline ml-2 drop-shadow-md">M Series</span>
      </div>

      <button 
        onClick={toggleMusic}
        className="pointer-events-auto flex items-center gap-3 px-4 py-2 bg-black/20 hover:bg-black/40 border border-white/10 rounded-full backdrop-blur-md transition-all text-white group"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors hidden sm:block">
          {isPlaying ? "Sound On" : "Sound Off"}
        </span>
        <div className="relative flex items-center justify-center">
          {isPlaying ? (
            <Volume2 className="w-4 h-4 text-white" />
          ) : (
            <VolumeX className="w-4 h-4 text-white/50 group-hover:text-white" />
          )}
        </div>
      </button>
    </motion.nav>
  );
}
