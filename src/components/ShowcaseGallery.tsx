"use client";

import { motion } from "framer-motion";

const images = [
  {
    src: "/gallery/4k-bmw-m4-gts-orange-9lyk452z7sazaa18.webp",
    alt: "BMW M4 GTS Orange",
    title: "M4 GTS",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-2",
  },
  {
    src: "/gallery/wp3268502.webp",
    alt: "BMW Driving Sunset",
    title: "Sunset Drive",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
  },
  {
    src: "/gallery/wp3616641.webp",
    alt: "BMW Dashboard",
    title: "Interior Crafts",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
  },
  {
    src: "/gallery/4k-bmw-m6-gray-3wun9ykisgilw4ex.webp",
    alt: "BMW M6 Gray",
    title: "Sleek Gray",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-2",
  },
  {
    src: "/gallery/4k-bmw-4-series-x44p1lte1sjdpod1.webp",
    alt: "BMW 4 Series White",
    title: "4 Series",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-1",
  },
];

export default function ShowcaseGallery() {
  return (
    <section className="w-full bg-[#050505] py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-white/10 pb-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-[#0066b1] mb-2">Visually Striking</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter">
              Gallery
            </h2>
          </motion.div>
          <motion.p
             initial={{ opacity: 0, x: 30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
             className="text-white/50 max-w-sm md:text-right"
          >
            A closer look at the stunning design and engineering that define the ultimate driving experience.
          </motion.p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-4 md:gap-6">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.1 }}
              className={`relative group overflow-hidden rounded-sm bg-zinc-900 ${img.colSpan} ${img.rowSpan}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              
              {/* Glassmorphic overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                <span className="text-white font-medium uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {img.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
