"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import EngineeringExcellence from "@/components/EngineeringExcellence";
import VideoHighlight from "@/components/VideoHighlight";
import ShowcaseGallery from "@/components/ShowcaseGallery";
import Footer from "@/components/Footer";

const BMWScrollSequence = dynamic(() => import("@/components/BMWScrollSequence"), { ssr: false });

export default function Home() {
  return (
    <main className="w-full bg-black min-h-screen text-white relative">
      <audio id="bg-music" src="/videos/music.mp3" loop preload="auto" />
      <Navbar />
      <BMWScrollSequence />
      <EngineeringExcellence />
      <VideoHighlight />
      <ShowcaseGallery />
      <Footer />
    </main>
  );
}
