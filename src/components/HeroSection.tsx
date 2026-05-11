"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { useState, useEffect } from "react";

const typewriterText = `const INITIALIZE_SYSTEM = async () => { const Developer = { ID: "Muhammad_Hanif_Hawari", Origin: "Bengkulu_Indonesia", Role: "Creative_Engineer", Mindset: "Systematic_Thinking_With_Visual_Sensitivity" }; await System.load("Next.js", "React", "TypeScript", "Tailwind_CSS", "Framer_Motion"); if (Project.isComplex) return Developer.solveWith(Physics + Logic + Experience); const Mission = "Crafting digital experiences that feel alive, intentional, and intuitive."; const magic = Developer.create({ clarity: true, aesthetics: "Bold_but_Purposeful", interaction: "Smooth", motion: "Physics_Inspired" }); return magic.deploy(); }; // Status: ONLINE | Mode: OPEN_TO_WORK <END_OF_SCRIPT>`;

export default function HeroSection() {
  const { t } = useLanguage();
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isTyping) {
      if (displayedText.length < typewriterText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(typewriterText.slice(0, displayedText.length + 1));
        }, 30);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 3000);
      }
    } else {
      setDisplayedText("");
      setIsTyping(true);
    }
    return () => clearTimeout(timeout);
  }, [displayedText, isTyping]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#0a0a0a]"
    >
      {/* Subtle gradient overlay at top */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-950/10 to-transparent pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-center justify-center px-6 pt-20"
      >
        {/* Badge pills row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 mb-6"
        >
          {t.hero.badges.map((badge, i) => (
            <span
              key={i}
              className="px-5 py-2.5 border border-zinc-700 text-xs sm:text-sm font-semibold tracking-widest text-white bg-transparent hover:bg-white/5 transition-colors"
            >
              {badge}
            </span>
          ))}
        </motion.div>

        {/* Tag badges row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          {/* Star icon */}
          <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center text-white">
            <span className="text-lg">✦</span>
          </div>
          {t.hero.tagBadges.map((badge, i) => (
            <span
              key={i}
              className="px-4 py-2 border border-zinc-700 text-xs sm:text-sm font-medium tracking-wider text-zinc-300"
            >
              {badge}
            </span>
          ))}
          {/* Code icon */}
          <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center text-white">
            <span className="text-sm font-mono">&lt;/&gt;</span>
          </div>
        </motion.div>

        {/* Giant Name */}
        <motion.h1
          variants={itemVariants}
          className="text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] font-black leading-[0.85] tracking-tighter text-white text-center uppercase select-none"
          style={{ fontWeight: 900 }}
        >
          MUHAMMAD
          <br />
          HANIF HAWARI
        </motion.h1>

        {/* Code subtitle line with typewriter effect */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-[10px] sm:text-xs text-zinc-500 font-mono tracking-wide max-w-4xl text-center min-h-[60px]"
        >
          {displayedText}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-1.5 h-3.5 bg-zinc-400 ml-1 align-middle"
          />
        </motion.p>


      </motion.div>
    </section>
  );
}
