"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white border-t border-white/10 pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
          
          {/* Brand & CTA */}
          <div className="md:col-span-2 flex flex-col items-start gap-6 pr-8">
            <h3 className="text-2xl font-bold uppercase tracking-tight">BMW M Series</h3>
            <p className="text-white/60 max-w-sm">
              Discover the latest models, cutting-edge technology, and unparalleled performance from the Ultimate Driving Machine.
            </p>
            <div className="relative w-full max-w-sm border-b border-white/30 pb-2 flex items-center group">
              <input 
                type="email" 
                placeholder="SUBSCRIBE FOR UPDATES" 
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-white/30 uppercase tracking-widest"
              />
              <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold uppercase tracking-widest text-[#0066b1] text-xs mb-2">Explore</h4>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Models</a>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Build Your Own</a>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">BMW M</a>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">BMW Electrified</a>
          </div>

          {/* Legal / Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold uppercase tracking-widest text-[#0066b1] text-xs mb-2">Contact</h4>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Find a Dealer</a>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Test Drive</a>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Contact Us</a>
            <a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Careers</a>
          </div>
          
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
          <p className="text-xs text-white/40 tracking-widest uppercase">
            &copy; {new Date().getFullYear()} BMW of North America, LLC.
          </p>
          
          {/* Socials */}
          <div className="flex items-center gap-4">
             <a href="#" className="text-xs text-white/70 hover:text-white transition-colors">FACEBOOK</a>
             <a href="#" className="text-xs text-white/70 hover:text-white transition-colors">TWITTER</a>
             <a href="#" className="text-xs text-white/70 hover:text-white transition-colors">INSTAGRAM</a>
             <a href="#" className="text-xs text-white/70 hover:text-white transition-colors">YOUTUBE</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
