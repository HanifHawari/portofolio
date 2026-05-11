"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ── Animated vertical progress line ─────────────────────────────────────────
function TimelineProgress({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when section top hits bottom of viewport, 1 when section bottom hits top
      const p = Math.max(0, Math.min(1, (vh - rect.top) / (rect.height + vh * 0.5)));
      setProgress(p);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [sectionRef]);

  return (
    <>
      {/* Background track */}
      <div
        className="absolute left-[7px] sm:left-[140px] top-0 bottom-0 w-px"
        style={{ background: "var(--border-strong)" }}
      />
      {/* Filled progress line */}
      <motion.div
        className="absolute left-[7px] sm:left-[140px] top-0 w-px origin-top"
        style={{
          background: "linear-gradient(to bottom, var(--foreground), rgba(255,255,255,0.2))",
          height: `${progress * 100}%`,
          boxShadow: progress > 0.02 ? "0 0 8px 1px rgba(255,255,255,0.15)" : "none",
        }}
      />
      {/* Removed the glowing dot as requested, keeping only the smooth line fill */}
    </>
  );
}

export default function JourneySection() {
  const { t } = useLanguage();
  const [openArchive, setOpenArchive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="journey" ref={sectionRef} className="py-24 sm:py-32 bg-[#0a0a0a]">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
            {t.journey.title}
          </h2>
          <p className="text-zinc-400 max-w-xl leading-relaxed">
            {t.journey.subtitle}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          <TimelineProgress sectionRef={sectionRef} />

          <div className="space-y-12">
            {t.journey.items.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.08 }}
                className="relative flex flex-col sm:flex-row gap-4 sm:gap-8"
              >
                {/* Left: Year + Badge */}
                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:w-[130px] shrink-0">
                  <span className="text-lg sm:text-xl font-black text-white">
                    {item.year}
                  </span>
                  <span className="px-2.5 py-1 bg-zinc-800 text-[10px] font-bold tracking-[0.15em] text-zinc-400">
                    {item.badge}
                  </span>
                </div>

                {/* Timeline dot — glows when in view */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: index * 0.08 + 0.3 }}
                  className="absolute left-[3px] sm:left-[136px] top-1.5 z-10"
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    border: "2px solid var(--foreground)",
                    background: "var(--background)",
                    boxShadow: "0 0 8px 2px rgba(255,255,255,0.2)",
                  }}
                />

                {/* Right: Card */}
                <motion.div
                  className="ml-6 sm:ml-0 flex-1 border border-zinc-800 bg-zinc-950/50 p-6 sm:p-8 relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] active:translate-y-0 active:scale-[0.98] transition-all duration-300"
                >
                  {/* Ultra Minimalist Top-Glow Accent */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-500/30 to-transparent" />
                  <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute top-0 left-1/4 right-1/4 h-[12px] bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm pointer-events-none" />

                  <div className="relative z-10">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                      {item.role}
                    </h3>
                    <p className="text-zinc-500 text-sm mb-4 tracking-wide">
                      {item.company}
                    </p>
                    <p className="text-zinc-400 leading-relaxed mb-6 max-w-lg text-sm">
                      {item.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 border border-zinc-800 text-xs font-medium text-zinc-400 tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Project Archive */}
                    <button
                      onClick={() =>
                        setOpenArchive(openArchive === index ? null : index)
                      }
                      className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors"
                    >
                      <FolderOpen size={16} />
                      <span className="text-xs font-bold tracking-[0.2em] uppercase">
                        {item.archiveLabel}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${openArchive === index ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {openArchive === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t border-zinc-800 space-y-3">
                            {item.projects && item.projects.length > 0 ? (
                              item.projects.map((p: any, i: number) => (
                                <a
                                  key={i}
                                  href={p.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 border border-zinc-800 hover:border-zinc-700 transition-colors group"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                                      <span className="text-zinc-500 group-hover:text-white transition-colors text-xs">📁</span>
                                    </div>
                                    <div>
                                      <p className="text-sm text-white font-medium group-hover:text-zinc-300 transition-colors">{p.name}</p>
                                      <p className="text-[10px] text-zinc-500">{item.year} · {p.status}</p>
                                    </div>
                                  </div>
                                  <span className="text-zinc-600 group-hover:text-white transition-colors text-xs">→</span>
                                </a>
                              ))
                            ) : (
                              <div className="p-3 text-center text-xs text-zinc-500 border border-zinc-800 border-dashed">
                                Tidak ada arsip proyek (Belum ditambahkan)
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
