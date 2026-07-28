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
        // Trik CSS: invert mengubah hitam jadi putih, tapi merusak warna. 
        // hue-rotate-180 mengembalikan warna (hue) ke aslinya!
        className="dark:invert dark:hue-rotate-180"
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain',
          transform: 'translateZ(0)'
        }} 
      />
    </motion.div>
  );
}
