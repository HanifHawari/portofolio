/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { motion } from "framer-motion";

// Tipe varian dibiarkan agar tidak terjadi error pada komponen yang memanggil file ini
export type LogoVariant = "monogram" | "geometric" | "circle" | "terminal";

interface LogoProps {
  variant?: LogoVariant;
  size?: number;
  className?: string;
}

export default function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center justify-center transform-gpu antialiased ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Memanggil gambar logo.gif langsung dari folder public */}
      <img 
        src="/logo.gif" 
        alt="Logo Animasi" 
        // Menggunakan hue-rotate-[280deg] untuk menggeser warnanya dari pink ke arah ungu yang lebih 'deep' / kebiruan
        // Meningkatkan saturasi agar warnanya lebih 'menyala' dan serasi dengan video webm
        // mix-blend-screen memastikan setiap latar belakang gelap (kotak) pada GIF akan tembus pandang 100%
        className="dark:invert drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] hue-rotate-[280deg] saturate-150 contrast-125 mix-blend-screen"
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          transform: 'translateZ(0)',
          imageRendering: 'high-quality'
        }} 
      />
    </motion.div>
  );
}
