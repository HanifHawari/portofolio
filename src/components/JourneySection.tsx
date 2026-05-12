"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

// ── Folder open sound ────────────────────────────────────────────────────────
function playFolderSound() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

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
  } catch {
    // silent fail
  }
}

// ── Folder SVG icon with animated lid ────────────────────────────────────────
function FolderIcon({ isOpen, size = 40 }: { isOpen: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      style={{ overflow: "visible" }}
    >
      {/* Folder body */}
      <rect x="4" y="16" width="40" height="26" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="4" y="16" width="40" height="26" rx="3" stroke="currentColor" strokeWidth="2" />

      {/* Folder tab */}
      <path d="M4 16 L4 12 Q4 10 6 10 L18 10 Q20 10 21 12 L23 16Z" fill="currentColor" opacity="0.25" />
      <path d="M4 16 L4 12 Q4 10 6 10 L18 10 Q20 10 21 12 L23 16Z" stroke="currentColor" strokeWidth="2" />

      {/* Animated lid */}
      <motion.g
        animate={isOpen ? { rotateX: -70, y: -6 } : { rotateX: 0, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{ originX: "50%", originY: "100%", transformPerspective: 400 }}
      >
        <rect x="4" y="13" width="40" height="6" rx="2" fill="currentColor" opacity="0.3" />
        <rect x="4" y="13" width="40" height="6" rx="2" stroke="currentColor" strokeWidth="2" />
      </motion.g>
    </svg>
  );
}

// ── Single photo per journey entry ───────────────────────────────────────────
// Replace src strings with your actual image paths
const GALLERY_DATA: { src: string; caption: string }[] = [
  { src: "/ecommerce.png", caption: "E-Commerce Project" },      // 0: Professional
  { src: "/cms.png",       caption: "Freelance Web Design" },     // 1: Freelance
  { src: "/fitness.png",   caption: "Agency Dashboard" },         // 2: Internship
  { src: "/cms.png",       caption: "Academic Web App" },          // 3: Student Dev
  { src: "/ecommerce.png", caption: "Database Design Project" },  // 4: Info Systems
];

// ── Animated vertical progress line ─────────────────────────────────────────
function TimelineProgress({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh - rect.top) / (rect.height + vh * 0.5)));
      setProgress(p);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [sectionRef]);

  return (
    <>
      <div
        className="absolute left-[7px] sm:left-[140px] top-0 bottom-0 w-px"
        style={{ background: "var(--border-strong)" }}
      />
      <motion.div
        className="absolute left-[7px] sm:left-[140px] top-0 w-px origin-top"
        style={{
          background: "linear-gradient(to bottom, var(--foreground), rgba(255,255,255,0.2))",
          height: `${progress * 100}%`,
          boxShadow: progress > 0.02 ? "0 0 8px 1px rgba(255,255,255,0.15)" : "none",
        }}
      />
    </>
  );
}

// ── Folder Modal ─────────────────────────────────────────────────────────────
function FolderModal({
  index,
  title,
  onClose,
}: {
  index: number;
  title: string;
  onClose: () => void;
}) {
  const photo = GALLERY_DATA[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.82, y: 36 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 70px rgba(0,0,0,0.85), 0 0 24px rgba(255,255,255,0.04)" }}
      >
        {/* Top glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-800">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.4, delay: 0.08, type: "spring", stiffness: 260, damping: 18 }}
            className="text-zinc-300"
          >
            <FolderIcon isOpen size={30} />
          </motion.div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Project Archive</p>
            <h3 className="text-white font-bold text-sm leading-tight">{title}</h3>
          </div>
          <button onClick={onClose} className="ml-auto text-zinc-600 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Single photo — auto-sized */}
        <div className="p-4">
          {photo ? (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative rounded-lg overflow-hidden border border-zinc-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full object-cover"
                style={{ aspectRatio: "1024/573" }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
                <p className="text-xs text-zinc-200 font-semibold">{photo.caption}</p>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-12 text-zinc-600 text-sm border border-dashed border-zinc-800 rounded-lg">
              Belum ada foto di folder ini
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Section ─────────────────────────────────────────────────────────────
export default function JourneySection() {
  const { t } = useLanguage();
  const [openFolder, setOpenFolder] = useState<number | null>(null);
  const [hoverFolder, setHoverFolder] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleOpenFolder = useCallback((index: number) => {
    playFolderSound();
    setOpenFolder(index);
  }, []);

  const handleClose = useCallback(() => setOpenFolder(null), []);

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
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 text-center">
            {t.journey.title}
          </h2>
          <p className="text-zinc-400 max-w-xl leading-relaxed text-center mx-auto">
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

                {/* Timeline dot */}
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

                    {/* ── Animated Folder Button ── */}
                    <motion.button
                      onClick={() => handleOpenFolder(index)}
                      onHoverStart={() => setHoverFolder(index)}
                      onHoverEnd={() => setHoverFolder(null)}
                      whileTap={{ scale: 0.93 }}
                      className="flex items-center gap-3 group/folder"
                    >
                      <motion.div
                        animate={
                          hoverFolder === index
                            ? { y: [0, -4, 0], rotate: [0, -5, 5, 0] }
                            : { y: 0, rotate: 0 }
                        }
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="text-zinc-400 group-hover/folder:text-white transition-colors duration-200"
                      >
                        <FolderIcon isOpen={hoverFolder === index} size={38} />
                      </motion.div>
                      <div className="text-left">
                        <p className="text-xs font-bold tracking-[0.2em] text-zinc-500 group-hover/folder:text-zinc-300 uppercase transition-colors">
                          Project Archive
                        </p>
                        <p className="text-[10px] text-zinc-700 group-hover/folder:text-zinc-500 transition-colors">
                          Click to open folder
                        </p>
                      </div>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Folder Modal */}
      <AnimatePresence>
        {openFolder !== null && (
          <FolderModal
            key={openFolder}
            index={openFolder}
            title={t.journey.items[openFolder]?.role ?? ""}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
