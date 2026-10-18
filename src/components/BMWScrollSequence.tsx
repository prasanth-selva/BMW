"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Lenis from "lenis";

const TOTAL_FRAMES = 300;
const MAX_CONCURRENT_LOADS = 8;

export default function BMWScrollSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [entered, setEntered] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const loadedFlagsRef = useRef<boolean[]>(Array(TOTAL_FRAMES).fill(false));
  const failedFlagsRef = useRef<boolean[]>(Array(TOTAL_FRAMES).fill(false));
  const frameImagesRef = useRef<Array<HTMLImageElement | null>>(Array(TOTAL_FRAMES).fill(null));
  const framePromisesRef = useRef<Array<Promise<boolean> | null>>(Array(TOTAL_FRAMES).fill(null));
  const retryIndicesRef = useRef<number[]>([]);

  // Framer motion scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map scroll progress to frame index
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    let isActive = true;
    const loadedImages = frameImagesRef.current.map((image) => image ?? new Image());
    frameImagesRef.current = loadedImages;
    setImages(loadedImages);

    const loadFrame = (index: number): Promise<boolean> => {
      if (loadedFlagsRef.current[index]) return Promise.resolve(true);
      const pendingLoad = framePromisesRef.current[index];
      if (pendingLoad) return pendingLoad;

      const img = loadedImages[index];
      const paddedIndex = (index + 1).toString().padStart(3, "0");
      img.decoding = "async";
      const load = new Promise<boolean>((resolve) => {
        const finish = (success: boolean) => {
          img.onload = null;
          img.onerror = null;
          resolve(success);
        };
        img.onload = () => finish(img.naturalWidth > 0);
        img.onerror = () => finish(false);
        img.src = `/hero/ezgif-frame-${paddedIndex}.webp`;
      });
      framePromisesRef.current[index] = load;
      return load;
    };

    const indices = retryAttempt === 0
      ? Array.from({ length: TOTAL_FRAMES }, (_, index) => index)
      : retryIndicesRef.current;
    let nextIndex = 0;
    const loadWorker = async () => {
      while (isActive && nextIndex < indices.length) {
        const index = indices[nextIndex++];
        const succeeded = await loadFrame(index);
        if (!isActive) return;
        loadedFlagsRef.current[index] = succeeded;
        failedFlagsRef.current[index] = !succeeded;
        setLoadedCount(loadedFlagsRef.current.filter(Boolean).length);
      }
    };

    const loadAllFrames = async () => {
      await Promise.all(
        Array.from(
          { length: Math.min(MAX_CONCURRENT_LOADS, indices.length) },
          () => loadWorker(),
        ),
      );
      if (!isActive) return;

      const failedIndices = failedFlagsRef.current.reduce<number[]>(
        (failures, failed, index) => {
          if (failed) failures.push(index);
          return failures;
        },
        [],
      );
      setFailedCount(failedIndices.length);
      if (failedIndices.length === 0 && loadedFlagsRef.current.every(Boolean)) {
        setLoaded(true);
      }
    };

    void loadAllFrames();

    return () => {
      isActive = false;
    };
  }, [retryAttempt]);

  useEffect(() => {
    if (!loaded) return;

    const lenis = new Lenis({ autoRaf: true, respectReducedMotion: true });
    document.documentElement.removeAttribute("data-sequence-loading");
    return () => {
      lenis.destroy();
      document.documentElement.removeAttribute("data-sequence-loading");
    };
  }, [loaded]);

  const retryFailedFrames = () => {
    const failedIndices = failedFlagsRef.current.reduce<number[]>(
      (failures, failed, index) => {
        if (failed) failures.push(index);
        return failures;
      },
      [],
    );
    if (failedIndices.length === 0) return;

    retryIndicesRef.current = failedIndices;
    failedIndices.forEach((index) => {
      failedFlagsRef.current[index] = false;
      framePromisesRef.current[index] = null;
      frameImagesRef.current[index]?.removeAttribute("src");
    });
    setFailedCount(0);
    setRetryAttempt((attempt) => attempt + 1);
  };

  useEffect(() => {
    if (!loaded || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle canvas resize
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(frameIndex.get());
    };

    const renderFrame = (index: number) => {
      const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(index)));
      let drawIndex = idx;
      while (drawIndex > 0 && !loadedFlagsRef.current[drawIndex]) {
        drawIndex--;
      }
      const img = images[drawIndex];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      // Draw image to cover or contain
      const targetRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      // Aspect fill logic to seamlessly blend background
      if (imgRatio > targetRatio) {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      ctx.fillStyle = "#050505"; // Match background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Subscribe to framer motion changes
    const unsubscribe = frameIndex.on("change", (latest) => {
      requestAnimationFrame(() => renderFrame(latest));
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      unsubscribe();
    };
  }, [loaded, images, frameIndex]);

  const handleEnter = () => {
    // Dispatch sound
    const audioEl = document.getElementById("bg-music") as HTMLAudioElement;
    if (audioEl) {
      audioEl.volume = 0.5;
      audioEl.play().catch(() => { });
      window.dispatchEvent(new Event("music-started"));
    }
    setEntered(true);
  };

  // Opacity transforms for text blocks
  // 0% Scroll: "THE ULTIMATE DRIVING MACHINE" (Centered).
  const titleOpacity = useTransform(scrollYProgress, [0, 0.1, 0.15], [1, 1, 0], { clamp: true });
  const titleY = useTransform(scrollYProgress, [0, 0.15], [0, -50], { clamp: true });

  // 30% Scroll: "Precision engineering in every component." (Left aligned)
  const text1Opacity = useTransform(scrollYProgress, [0.2, 0.3, 0.4, 0.45], [0, 1, 1, 0], { clamp: true });
  const text1Y = useTransform(scrollYProgress, [0.2, 0.3, 0.45], [50, 0, -50], { clamp: true });

  // 60% Scroll: "Uncompromising power, revealed." (Right aligned)
  const text2Opacity = useTransform(scrollYProgress, [0.5, 0.6, 0.7, 0.75], [0, 1, 1, 0], { clamp: true });
  const text2Y = useTransform(scrollYProgress, [0.5, 0.6, 0.75], [50, 0, -50], { clamp: true });

  // 90% Scroll: "Experience the M4." (Centered)
  const text3Opacity = useTransform(scrollYProgress, [0.8, 0.9, 1], [0, 1, 1], { clamp: true });
  const text3Y = useTransform(scrollYProgress, [0.8, 0.9], [50, 0], { clamp: true });

  return (
    <div ref={containerRef} className="h-[500vh] bg-[#050505]" style={{ position: "relative" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Content Layer (Canvas + UI) */}
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${entered ? "opacity-100" : "opacity-0"}`}>
          <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />

          {entered && (
            <div className="absolute inset-0 pointer-events-none p-8 md:p-16 lg:p-24 w-full h-full">
              {/* 0% Section - Top Centered */}
              <motion.div
                style={{ opacity: titleOpacity, y: titleY }}
                className="absolute top-1/4 left-0 w-full flex flex-col items-center justify-center text-center px-4"
              >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white mb-2 drop-shadow-lg">
                  The Ultimate
                  <br />
                  Driving Machine
                </h1>
              </motion.div>

              {/* 30% Section - Left Aligned vertically centered */}
              <motion.div
                style={{ opacity: text1Opacity, y: text1Y }}
                className="absolute top-1/2 -translate-y-1/2 left-4 md:left-24 w-11/12 md:max-w-sm"
              >
                <h2 className="text-2xl md:text-4xl font-semibold mb-2 md:mb-4 leading-tight text-white/90 drop-shadow-lg">
                  Precision engineering in every component.
                </h2>
                <p className="text-base md:text-lg text-white/60 drop-shadow-md">
                  A symphony of performance and meticulous craftsmanship. Every detail optimized.
                </p>
              </motion.div>

              {/* 60% Section - Right Bottom Aligned */}
              <motion.div
                style={{ opacity: text2Opacity, y: text2Y }}
                className="absolute bottom-1/4 right-4 md:right-24 w-11/12 md:max-w-sm text-right"
              >
                <h2 className="text-2xl md:text-4xl font-semibold mb-2 md:mb-4 leading-tight text-white/90 drop-shadow-lg">
                  Uncompromising power, revealed.
                </h2>
                <p className="text-base md:text-lg text-white/60 drop-shadow-md">
                  Beyond the surface lies a twin-turbocharged heart, built to dominate the asphalt.
                </p>
              </motion.div>

              {/* 90% Section - Bottom Centered */}
              <motion.div
                style={{ opacity: text3Opacity, y: text3Y }}
                className="absolute bottom-32 left-0 w-full flex flex-col items-center justify-center text-center px-4"
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight mb-8 text-white drop-shadow-lg">
                  Experience the M4
                </h2>
              </motion.div>
            </div>
          )}
        </div>

        {/* Loading / Gate Layer */}
        <div
          aria-busy={!loaded && failedCount === 0}
          className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-white transition-opacity duration-1000 ${entered ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
            }`}
        >
          {/* Authentic BMW SVG Logo */}
          <div className="mb-12 drop-shadow-xl relative hover:scale-105 transition-transform duration-700">
            <svg width="120" height="120" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
              {/* Outer ring */}
              <circle cx="50" cy="50" r="48" fill="#050505" stroke="#ccc" strokeWidth="3" />
              <circle cx="50" cy="50" r="32" fill="#050505" stroke="#ccc" strokeWidth="1" />
              {/* Quadrants */}
              <path d="M50 18 A32 32 0 0 1 82 50 L50 50 Z" fill="#fff" />
              <path d="M82 50 A32 32 0 0 1 50 82 L50 50 Z" fill="#0066b1" />
              <path d="M50 82 A32 32 0 0 1 18 50 L50 50 Z" fill="#fff" />
              <path d="M18 50 A32 32 0 0 1 50 18 L50 50 Z" fill="#0066b1" />
              {/* Letters */}
              <text x="24" y="31" fill="#fff" fontSize="12" fontFamily="sans-serif" fontWeight="bold" transform="rotate(-35 24 31)">B</text>
              <text x="50" y="16" fill="#fff" fontSize="12" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">M</text>
              <text x="76" y="31" fill="#fff" fontSize="12" fontFamily="sans-serif" fontWeight="bold" transform="rotate(35 76 31)">W</text>
            </svg>
          </div>

          {!loaded ? (
            <div className="flex flex-col items-center gap-4 transition-all">
              {failedCount === 0 ? (
                <>
                  <div aria-hidden="true" className="w-8 h-8 md:w-10 md:h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <div
                    className="w-56 h-1 overflow-hidden bg-white/15"
                    role="progressbar"
                    aria-label="Sequence frame loading progress"
                    aria-valuemin={0}
                    aria-valuemax={TOTAL_FRAMES}
                    aria-valuenow={loadedCount}
                  >
                    <div className="h-full bg-white transition-[width] duration-200" style={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }} />
                  </div>
                  <p className="text-xs md:text-sm tracking-widest uppercase text-white/50 mt-4">
                    Engine Starting... {Math.floor((loadedCount / TOTAL_FRAMES) * 100)}% ({loadedCount} of {TOTAL_FRAMES} frames ready)
                  </p>
                </>
              ) : (
                <div role="alert" className="flex max-w-md flex-col items-center gap-4 px-6 text-center">
                  <p className="text-sm text-white/80">
                    {failedCount} {failedCount === 1 ? "frame could" : "frames could"} not be loaded. The experience is still paused at {Math.floor((loadedCount / TOTAL_FRAMES) * 100)}%.
                  </p>
                  <button
                    type="button"
                    onClick={retryFailedFrames}
                    className="rounded-sm border border-white/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    Retry failed frames
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleEnter}
              className="px-10 py-4 bg-white text-black font-semibold uppercase tracking-[0.2em] text-xs md:text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Start Experience
            </motion.button>
          )}
        </div>

      </div>
    </div>
  );
}
