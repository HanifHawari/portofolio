"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { audioStore } from "@/lib/audioStore";

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};


// Ikon folder SVG dengan animasi tutup
function FolderIcon({ isOpen, size = 40 }: { isOpen: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      style={{ overflow: "visible" }}
    >
      {/* Badan folder */}
      <rect x="4" y="16" width="40" height="26" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="4" y="16" width="40" height="26" rx="3" stroke="currentColor" strokeWidth="2" />

      {/* Tab folder */}
      <path d="M4 16 L4 12 Q4 10 6 10 L18 10 Q20 10 21 12 L23 16Z" fill="currentColor" opacity="0.25" />
      <path d="M4 16 L4 12 Q4 10 6 10 L18 10 Q20 10 21 12 L23 16Z" stroke="currentColor" strokeWidth="2" />

      {/* Tutup folder beranimasi */}
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

// Satu foto per entri perjalanan
// Ganti dengan path gambar asli
const GALLERY_DATA: { src: string; caption: string }[] = [
  { src: "/proyek1.png", caption: "" },
  { src: "/proyek1.png", caption: "" },
  { src: "/proyek1.png", caption: "" },
  { src: "/proyek1.png", caption: "" },
  { src: "/proyek1.png", caption: "" },
];

// Garis progres vertikal beranimasi
function TimelineProgress({ sectionRef }: { sectionRef: React.RefObject<HTMLElement | null> }) {
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <>
      <div
        className="absolute left-[7px] sm:left-[140px] top-0 bottom-0 w-px"
        style={{ background: "var(--border-strong)" }}
      />
      <motion.div
        className="absolute left-[7px] sm:left-[140px] top-0 bottom-0 w-px origin-top"
        style={{
          background: "linear-gradient(to bottom, var(--foreground), rgba(255,255,255,0.2))",
          scaleY,
          opacity,
          boxShadow: "0 0 8px 1px rgba(255,255,255,0.15)",
        }}
      />
    </>
  );
}

// Modal Folder
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-700 rounded-[32px] overflow-hidden will-change-transform will-change-opacity"
        style={{ boxShadow: "0 0 70px rgba(0,0,0,0.85), 0 0 24px rgba(255,255,255,0.04)" }}
      >
        {/* Cahaya atas */}
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

        {/* Foto tunggal */}
        <div className="p-4">
          {photo ? (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative rounded-lg overflow-hidden border border-zinc-800"
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                className="w-full object-cover"
                style={{ aspectRatio: "1024/573" }}
                width={1024}
                height={573}
                unoptimized={true}
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

function JourneyCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`ml-6 sm:ml-0 flex-1 section-card p-6 sm:p-8 relative transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Bagian Utama
export default function JourneySection() {
  const { t } = useLanguage();
  const [openFolder, setOpenFolder] = useState<number | null>(null);
  const [hoverFolder, setHoverFolder] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleOpenFolder = useCallback((index: number) => {
    audioStore.playClickSound();
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

        {/* Garis Waktu */}
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
                {/* Tahun dan Lencana */}
                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:w-[130px] shrink-0 ml-6 sm:ml-0">
                  <span className="text-lg sm:text-xl font-black text-white">
                    {item.year}
                  </span>
                  <span className="px-2.5 py-1 rounded-none bg-zinc-800 text-[10px] font-bold tracking-[0.15em] text-zinc-400">
                    {item.badge}
                  </span>
                </div>

                {/* Titik garis waktu */}
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

                <JourneyCard>
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

                    {/* Tag teknologi */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 border border-zinc-800 rounded-full text-xs font-medium text-zinc-400 tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Tombol folder beranimasi */}
                    <motion.button
                      onClick={() => handleOpenFolder(index)}
                      onHoverStart={() => setHoverFolder(index)}
                      onHoverEnd={() => setHoverFolder(null)}
                      whileTap={{ scale: 0.93 }}
                      className="flex items-center gap-3 group/folder border border-zinc-800 rounded-xl px-4 py-3 hover:border-zinc-600 hover:bg-white/5 transition-all duration-200"
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
                </JourneyCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Folder */}
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
