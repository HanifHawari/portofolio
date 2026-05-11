"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, BookOpen, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

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
    <section id="projects" className="py-24 sm:py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4"
          >
            {t.projects.title}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-zinc-400 max-w-xl mb-16 leading-relaxed"
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
                className="group relative overflow-hidden border border-zinc-800 bg-zinc-950/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] active:translate-y-0 active:scale-[0.98] transition-all duration-500"
              >
                {/* Ultra Minimalist Top-Glow Accent */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-500/30 to-transparent z-20" />
                <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />
                <div className="absolute top-0 left-1/4 right-1/4 h-[12px] bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm pointer-events-none z-20" />

                <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
                  {/* Left: Content */}
                <div className="p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    {/* Category Badge */}
                    <span className="inline-block px-3 py-1 border border-zinc-700 text-[10px] font-bold tracking-[0.2em] text-zinc-400 mb-6">
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

                    {/* Tech Pills */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tech.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 border border-zinc-800 text-xs font-medium text-zinc-400 tracking-wider"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => setActiveCaseStudy(index)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-sm font-semibold text-white tracking-wider hover:bg-white hover:text-black transition-all duration-300 btn-glow"
                    >
                      <BookOpen size={14} />
                      {project.caseStudy}
                    </button>
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold tracking-wider hover:bg-zinc-200 transition-colors">
                      {project.visitSite}
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Right: Screenshot Image */}
                <div className="relative h-64 lg:h-auto bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-800 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  {/* Gradient Overlay for aesthetic */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
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
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setActiveCaseStudy(null)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 p-8 sm:p-12 max-h-[90vh] overflow-y-auto shadow-2xl"
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
                  <strong className="text-white">Overview:</strong> Ini adalah contoh tampilan studi kasus untuk proyek <strong>{t.projects.items[activeCaseStudy].title}</strong>. Di sini Anda bisa menjelaskan latar belakang masalah, tujuan proyek, dan peran Anda.
                </p>
                <p>
                  <strong className="text-white">Challenges:</strong> Ceritakan tantangan teknis atau desain yang Anda hadapi selama pengembangan proyek ini dan bagaimana Anda memecahkannya.
                </p>
                <p>
                  <strong className="text-white">Solutions:</strong> Jelaskan secara rinci solusi yang Anda implementasikan. Anda bisa menambahkan gambar struktur database, alur kerja (flowchart), atau cuplikan kode.
                </p>
                <p>
                  <strong className="text-white">Results:</strong> Terakhir, sebutkan hasil akhir yang dicapai. Misalnya peningkatan performa, feedback positif dari pengguna, atau metrik keberhasilan lainnya.
                </p>
              </div>
              
              <div className="mt-12 pt-8 border-t border-zinc-800 flex justify-end">
                <button
                  onClick={() => setActiveCaseStudy(null)}
                  className="px-6 py-2 bg-white text-black text-sm font-bold tracking-wider hover:bg-zinc-200 transition-colors"
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
