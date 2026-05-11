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
      {/* Glowing dot at progress tip */}
      {progress > 0.01 && progress < 0.99 && (
        <motion.div
          style={{
            position: "absolute",
            left: "7px",
            top: `${progress * 100}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 30,
          }}
          className="hidden sm:block"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "var(--foreground)",
              border: "2px solid var(--background)",
              boxShadow: "0 0 10px 2px rgba(255,255,255,0.25)",
            }}
          />
        </motion.div>
      )}
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
                  whileHover={{ y: -2, borderColor: "rgba(255,255,255,0.15)" }}
                  transition={{ duration: 0.2 }}
                  className="ml-6 sm:ml-0 flex-1 border border-zinc-800 bg-zinc-950/50 p-6 sm:p-8 relative overflow-hidden"
                >
                  {/* Decorative large year */}
                  <div className="absolute -right-4 -bottom-6 text-[120px] font-black text-zinc-900/20 leading-none select-none pointer-events-none">
                    {item.year}
                  </div>

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
                            {[1, 2, 3].map((p) => (
                              <div
                                key={p}
                                className="flex items-center justify-between p-3 border border-zinc-800 hover:border-zinc-700 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-zinc-800 flex items-center justify-center">
                                    <span className="text-zinc-500 text-xs">📁</span>
                                  </div>
                                  <div>
                                    <p className="text-sm text-white font-medium">Project {p}</p>
                                    <p className="text-[10px] text-zinc-500">{item.year} · Archived</p>
                                  </div>
                                </div>
                                <span className="text-zinc-600 text-xs">→</span>
                              </div>
                            ))}
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
