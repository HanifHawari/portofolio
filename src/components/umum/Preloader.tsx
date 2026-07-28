"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/components/umum/Logo";

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Total durasi simulasi loading
    const duration = 2800;
    const interval = 30;
    let currentProgress = 0;

    const progressInterval = setInterval(() => {
      currentProgress += (100 / (duration / interval));
      if (currentProgress >= 100) {
        setProgress(100);
        clearInterval(progressInterval);

        setTimeout(() => {
          setIsLoading(false);
          if (onComplete) onComplete();

          setTimeout(() => {
            document.body.style.overflow = "auto";
          }, 3000); // Tunggu sampai animasi iris selesai
        }, 500); // Jeda sejenak di 100% sebelum animasi menutup dimulai
      } else {
        setProgress(currentProgress);
      }
    }, interval);

    return () => {
      clearInterval(progressInterval);
      document.body.style.overflow = "auto";
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[99999] pointer-events-none flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Latar Belakang Iris Reveal Menggunakan SVG Mask - GPU Optimized */}
          <motion.svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "linear" }}
            style={{ willChange: "opacity" }}
          >
            <defs>
              <mask id="iris-mask">
                <rect width="100%" height="100%" fill="white" />
                <motion.circle
                  cx="50%" cy="50%"
                  r="10vmax"
                  initial={{ scale: 0 }}
                  exit={{ scale: 20 }} // 10vmax * 20 = 200vmax (pasti menutupi seluruh layar)
                  transition={{
                    duration: 1.2,
                    ease: [0.65, 0, 0.35, 1] 
                  }}
                  style={{ transformOrigin: "center", willChange: "transform" }}
                  fill="black"
                />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="#0a0a0a" mask="url(#iris-mask)" />
          </motion.svg>

          {/* Konten Tengah (Animasi) */}
          <motion.div
            exit={{ scale: 1.5, opacity: 0 }} // Menghapus filter blur karena membebani GPU/CPU HP low-end
            transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
            className="relative z-10 flex items-center justify-center perspective-[1200px] mb-20 will-change-transform transform-gpu"
          >
            {/* Latar Belakang Animasi (animation.webm) */}
            <div className="absolute w-[400px] h-[400px] rounded-full overflow-hidden flex items-center justify-center pointer-events-none z-0 transform-gpu drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <video
                src="/animation.webm"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: "translate3d(0, 0, 0)", backfaceVisibility: "hidden" }}
              />
            </div>

            {/* Background Gelap Penutup Teks di Tengah Video */}
            <div className="absolute w-[130px] h-[130px] bg-[#0a0a0a] rounded-full z-10" />

            {/* Logo H (Depan) */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="relative z-20 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              <Logo size={80} />
            </motion.div>
          </motion.div>

          {/* Area Loading (Progress Bar & Robot) */}
          <motion.div
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-20 z-10 w-full max-w-md px-8 flex flex-col items-center"
          >
            {/* Robot Berjalan (mengikuti persentase progress) */}
            <div className="w-full relative h-12 mb-2">
              <motion.div
                className="absolute bottom-0 flex flex-col items-center will-change-[left]"
                animate={{ left: `calc(${progress}% - 20px)` }} // 20px = setengah lebar robot agar pas di tengah indikator
                transition={{ type: "tween", ease: "linear", duration: 0.1 }}
              >
                {/* Balon chat kecil */}
                <div className="bg-zinc-800 text-white text-[9px] px-1.5 py-0.5 rounded shadow mb-1 border border-zinc-700 whitespace-nowrap">
                  {Math.round(progress)}%
                </div>
                {/* GIF Robot */}
                <Image
                  src="/icons/robot.gif"
                  alt="Running Robot"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]"
                  // Membalik arah robot jika progress bar berjalan dari kiri ke kanan, 
                  // karena GIF aslinya menghadap kiri (scaleX(-1) untuk menghadap kanan)
                  style={{ transform: "scaleX(-1)" }}
                  unoptimized={true}
                />
              </motion.div>
            </div>

            {/* Progress Bar Container - GPU Optimized */}
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner transform-gpu">
              <motion.div
                className="w-full h-full bg-purple-500 shadow-[0_0_10px_#a855f7] origin-left will-change-transform"
                animate={{ scaleX: progress / 100 }}
                transition={{ type: "tween", ease: "linear", duration: 0.1 }}
              />
            </div>

            <div className="mt-4 text-zinc-500 font-mono text-[10px] tracking-[0.3em] uppercase">
              {progress < 100 ? "Loading Resources..." : "System Online"}
            </div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
