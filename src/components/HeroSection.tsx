"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

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

        {/* Code subtitle line */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-[10px] sm:text-xs text-zinc-500 font-mono tracking-wide max-w-4xl text-center"
        >
          <span className="text-zinc-600">const</span>{" "}
          <span className="text-zinc-400">INITIALIZE_SYSTEM</span>{" "}
          <span className="text-zinc-600">=</span>{" "}
          <span className="text-zinc-500">async</span>{" "}
          <span className="text-zinc-600">() =&gt;</span>{" "}
          <span className="text-zinc-600">{"{"}</span>{" "}
          <span className="text-zinc-600">const</span>{" "}
          <span className="text-zinc-400">Developer</span>{" "}
          <span className="text-zinc-600">=</span>{" "}
          <span className="text-zinc-600">{"{"}</span>{" "}
          <span className="text-zinc-500">ID:</span>{" "}
          <span className="text-zinc-400">&quot;HANIF_HAWARI&quot;</span>,{" "}
          <span className="text-zinc-500">Origin:</span>{" "}
          <span className="text-zinc-400">&quot;Indonesia&quot;</span>,{" "}
          <span className="text-zinc-500">Role:</span>{" "}
          <span className="text-zinc-400">&quot;Creative_Engineer&quot;</span>
          {" }"}
        </motion.p>


      </motion.div>
    </section>
  );
}
