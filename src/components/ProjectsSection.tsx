"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen } from "lucide-react";
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
              className="group border border-zinc-800 bg-zinc-950/30 hover:border-zinc-700 transition-all duration-500"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
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
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-sm font-semibold text-white tracking-wider hover:bg-white hover:text-black transition-all duration-300 btn-glow">
                      <BookOpen size={14} />
                      {project.caseStudy}
                    </button>
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold tracking-wider hover:bg-zinc-200 transition-colors">
                      {project.visitSite}
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>

                {/* Right: Screenshot placeholder */}
                <div className="relative h-64 lg:h-auto bg-zinc-900/50 border-t lg:border-t-0 lg:border-l border-zinc-800 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 mx-auto border border-zinc-700 flex items-center justify-center">
                        <span className="text-zinc-600 font-mono text-xs">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="text-zinc-600 text-xs tracking-widest uppercase">
                        Project Preview
                      </p>
                    </div>
                  </div>
                  {/* Decorative grid lines */}
                  <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: '40px 40px',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
