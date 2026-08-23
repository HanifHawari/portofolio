"use client";

import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/KonteksBahasa";

const itemVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function FolderIcon({ size = 40 }: { size?: number }) {
  return (
    <Image
      src="/icons/folder.gif" 
      alt="Project Archive"
      width={size}
      height={size}
      unoptimized={true}
      style={{ objectFit: "contain" }}
    />
  );
}

const GALLERY_DATA: { src: string; caption: string }[] = [
  { src: "/proyek1.png", caption: "Full-Stack Developer" },
  { src: "/proyek1.png", caption: "Proyek Freelance" },
  { src: "/foto-web2025.png", caption: "Pengembangan Web 2025" },
  { src: "/foto-mahasiswa2024.png", caption: "Mahasiswa Informatika" },
  { src: "/foto-maba2023.png", caption: "Mahasiswa Baru 2023" },
];

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
        className="absolute left-[15px] sm:left-[140px] top-0 bottom-0 w-px"
        style={{ background: "var(--border-strong)" }}
      />
      <motion.div
        className="absolute left-[15px] sm:left-[140px] top-0 bottom-0 w-px origin-top"
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

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 z-0 bg-black/75 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-2xl bg-zinc-950 border border-zinc-700 rounded-[32px] overflow-hidden will-change-transform will-change-opacity"
        style={{ boxShadow: "0 0 70px rgba(0,0,0,0.85), 0 0 24px rgba(255,255,255,0.04)" }}
      >
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-800">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.4, delay: 0.08, type: "spring", stiffness: 260, damping: 18 }}
            className="text-zinc-300"
          >
            <FolderIcon size={30} />
          </motion.div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Project Archive</p>
            <h3 className="text-white font-bold text-sm leading-tight">{title}</h3>
          </div>
          <button onClick={() => { onClose(); }} className="ml-auto text-zinc-600 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

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
                className="w-full h-auto object-contain max-h-[70vh] bg-zinc-950/50"
                width={1024}
                height={1024}
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
    </motion.div>,
    document.body
  );
}

function JourneyCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={`ml-8 sm:ml-0 flex-1 section-card p-6 sm:p-8 relative transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function JourneySection() {
  const { t } = useLanguage();
  const [openFolder, setOpenFolder] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const handleOpenFolder = useCallback((index: number) => {
    setOpenFolder(index);
  }, []);

  const handleClose = useCallback(() => setOpenFolder(null), []);

  return (
    <section id="journey" ref={sectionRef} className="py-24 sm:py-32 bg-[#0a0a0a]">
      {/* Preload images so they appear instantly when the modal is opened */}
      <div style={{ display: "none" }}>
        {GALLERY_DATA.map((photo, i) => (
          <Image key={i} src={photo.src} alt="preload" width={10} height={10} priority unoptimized={true} />
        ))}
      </div>
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
                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:w-[130px] shrink-0 ml-8 sm:ml-0">
                  <span className="text-lg sm:text-xl font-black text-white">
                    {item.year}
                  </span>
                  <span className="px-2.5 py-1 rounded-none bg-zinc-800 text-[10px] font-bold tracking-[0.15em] text-zinc-400">
                    {item.badge}
                  </span>
                </div>

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: index * 0.08 + 0.3 }}
                  className="absolute left-[11px] sm:left-[136px] top-1.5 z-10"
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

                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.tags.map((tag, i) => (
                        <motion.span
                          key={i}
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          className="px-3 py-1 rounded-full border border-zinc-700 text-xs font-medium tracking-wider text-zinc-300 hover:text-white hover:border-zinc-500 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-colors duration-300 cursor-default bg-zinc-900/50"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>

                    <motion.button
                      onClick={() => handleOpenFolder(index)}
                      whileTap={{ scale: 0.93 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      className="flex items-center gap-3 group/folder border border-zinc-700 rounded-xl px-4 py-3 bg-zinc-900/50 hover:border-zinc-500 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-colors duration-300"
                    >
                      <div className="text-foreground transition-colors duration-300">
                        <FolderIcon size={38} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold tracking-[0.2em] text-zinc-300 group-hover/folder:text-white uppercase transition-colors duration-300">
                          {item.archiveLabel || "Project Archive"}
                        </p>
                        <p className="text-[10px] text-zinc-400 group-hover/folder:text-zinc-300 transition-colors duration-300">
                          {item.archiveTap || "Click to open folder"}
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
