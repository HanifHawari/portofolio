"use client";

import React from "react";
import { motion } from "framer-motion";

export type LogoVariant = "monogram" | "geometric" | "circle" | "terminal";

interface LogoProps {
  variant?: LogoVariant;
  size?: number;
  className?: string;
}

export default function Logo({ variant = "monogram", size = 32, className = "" }: LogoProps) {
  const renderLogo = () => {
    switch (variant) {
      case "monogram":
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 10V30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M28 14V30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M12 20H28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <circle cx="28" cy="8" r="3" fill="#3b82f6" />
          </svg>
        );
      case "geometric":
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 10V30M30 10V30M10 20H30" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
            <path d="M10 10L15 10M25 30L30 30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
      case "circle":
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            <path d="M14 12V28M26 12V28M14 20H26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
      case "terminal":
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12L16 20L8 28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 28H32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center justify-center ${className}`}
    >
      {renderLogo()}
    </motion.div>
  );
}
