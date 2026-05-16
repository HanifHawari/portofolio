"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, BookOpen, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { audioStore } from "@/lib/audioStore";

interface ProjectItem {
  category: string;
  title: string;
  description: string;
  stats: { value: string; label: string }[];
  tech: string[];
  caseStudy: string;
  liveUrl: string;
  codeUrl: string;
  image: string;
  caseStudyContent: {
    overview: string;
    challenges: string;
    solutions: string;
    results: string;
  };
}

const Github = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const playClickSound = () => {
  const ctx = audioStore.getContext();
  if (!ctx) return;

  try {
    // Click-thud sound
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    // Whoosh sweep
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(200, ctx.currentTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.25);
    oscGain.gain.setValueAtTime(0, ctx.currentTime + 0.05);
    oscGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(ctx.currentTime + 0.05);
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {
    console.log("Audio play failed", e);
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function ProjectsSection() {
  const { t } = useLanguage();
  const [activeCaseStudy, setActiveCaseStudy] = useState<number | null>(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeCaseStudy !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activeCaseStudy]);

  return (
    <section id="projects" className="py-24 sm:py-32 bg-[#0a0a0a]" style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 text-center"
          >
            {t.projects.title}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-zinc-400 max-w-xl mb-16 leading-relaxed text-center mx-auto"
          >
            {t.projects.subtitle}
          </motion.p>
        </motion.div>

        {/* Project Cards */}
        <div className="space-y-8">
          {t.projects.items.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="group relative overflow-hidden section-card hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(0,0,0,0.65)] active:translate-y-0 active:scale-[0.98] transition-all duration-500"
            >
              {/* Top-glow accent via .section-card::before */}

              <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
                {/* Left: Content */}
                <div className="p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    {/* Category Badge — sharp, terminal-style */}
                    <span className="inline-block px-3 py-1 border border-zinc-700 rounded-none text-[10px] font-bold tracking-[0.2em] text-zinc-400 mb-6">
                      {project.category}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-4 group-hover:translate-x-1 transition-transform duration-300">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-zinc-400 leading-relaxed mb-8 max-w-md">
                      {project.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {project.stats.map((stat, i) => (
                        <div key={i}>
                          <div className="text-2xl sm:text-3xl font-black text-white">
                            {stat.value}
                          </div>
                          <div className="text-[10px] sm:text-xs text-zinc-500 tracking-wider uppercase mt-1">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tech Pills — rounded-full */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tech.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 border border-zinc-800 rounded-full text-xs font-medium text-zinc-400 tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        playClickSound();
                        setActiveCaseStudy(index);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-semibold text-white tracking-wider hover:bg-white/10 hover:border-zinc-500 transition-all duration-300"
                    >
                      <BookOpen size={14} />
                      {(project as unknown as ProjectItem).caseStudy}
                    </button>
                    <a
                      href={(project as unknown as ProjectItem).liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-full text-sm font-semibold tracking-wider hover:bg-zinc-200 transition-colors"
                    >
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(t.projects as any).liveDemo}
                      <ArrowUpRight size={14} />
                    </a>
                    <a
                      href={(project as unknown as ProjectItem).codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 rounded-full text-sm font-semibold text-white tracking-wider hover:bg-zinc-800 hover:border-zinc-600 transition-colors"
                    >
                      <Github size={14} />
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {(t.projects as any).sourceCode}
                    </a>
                  </div>
                </div>

                {/* Right: Screenshot Image */}
                <div
                  className="relative h-64 lg:h-auto bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-800 overflow-hidden group/img cursor-pointer"
                  onClick={() => {
                    playClickSound();
                    setActiveCaseStudy(index);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  {/* Gradient Overlay for aesthetic */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none z-10" />

                  {/* Hover button overlay on Image */}
                  <div className="absolute inset-0 z-20 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 group-hover/img:opacity-100 bg-black/40 backdrop-blur-sm transition-all duration-300">
                    <a
                      href={(project as unknown as ProjectItem).liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="transform translate-y-4 group-hover/img:translate-y-0 transition-transform duration-300 delay-75"
                    >
                      <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold tracking-wider rounded-full shadow-2xl hover:bg-zinc-200 transition-colors">
                        <ArrowUpRight size={16} />
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(t.projects as any).liveDemo}
                      </span>
                    </a>
                    <a
                      href={(project as unknown as ProjectItem).codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="transform translate-y-4 group-hover/img:translate-y-0 transition-transform duration-300 delay-150"
                    >
                      <span className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white text-sm font-bold tracking-wider rounded-full shadow-2xl hover:bg-zinc-800 transition-colors border border-zinc-700">
                        <Github size={16} />
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {(t.projects as any).sourceCode}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Case Study Modal Overlay */}
      <AnimatePresence>
        {activeCaseStudy !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setActiveCaseStudy(null)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-700 rounded-[32px] p-8 sm:p-12 max-h-[90vh] overflow-y-auto shadow-2xl will-change-transform will-change-opacity"
            >
              <button
                onClick={() => setActiveCaseStudy(null)}
                className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl sm:text-4xl font-black text-white mb-2">
                {t.projects.items[activeCaseStudy].title}
              </h3>
              <p className="text-zinc-500 mb-8 font-bold tracking-[0.2em] uppercase text-xs">
                {t.projects.items[activeCaseStudy].category} - Case Study
              </p>

              <div className="space-y-6 text-zinc-400 leading-relaxed text-sm sm:text-base">
                <p>
                  <strong className="text-white">Overview:</strong> {(t.projects.items[activeCaseStudy] as unknown as ProjectItem).caseStudyContent.overview}
                </p>
                <p>
                  <strong className="text-white">Challenges:</strong> {(t.projects.items[activeCaseStudy] as unknown as ProjectItem).caseStudyContent.challenges}
                </p>
                <p>
                  <strong className="text-white">Solutions:</strong> {(t.projects.items[activeCaseStudy] as unknown as ProjectItem).caseStudyContent.solutions}
                </p>
                <p>
                  <strong className="text-white">Results:</strong> {(t.projects.items[activeCaseStudy] as unknown as ProjectItem).caseStudyContent.results}
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-end">
                <button
                  onClick={() => setActiveCaseStudy(null)}
                  className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold tracking-wider hover:bg-zinc-200 transition-colors"
                >
                  TUTUP
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
