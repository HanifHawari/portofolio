"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useLanguage } from "@/lib/KonteksBahasa";
import { audioStore } from "@/lib/penyimpananAudio";

interface GalleryImage {
  src: string;
  caption: string;
}

interface AchievementItem {
  category: string;
  title: string;
  description: string;
  stats: { value: string; label: string }[];
  archiveLabel: string;
  archiveTap: string;
  detail: string;
  liveUrl: string;
  image: string;
  galleryImages: GalleryImage[];
}

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

/* ── Folder icon — identik JourneySection ── */
function FolderIcon({ isOpen, size = 40 }: { isOpen: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" style={{ overflow: "visible" }}>
      <rect x="4" y="16" width="40" height="26" rx="3" fill="currentColor" opacity="0.15" />
      <rect x="4" y="16" width="40" height="26" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M4 16 L4 12 Q4 10 6 10 L18 10 Q20 10 21 12 L23 16Z" fill="currentColor" opacity="0.25" />
      <path d="M4 16 L4 12 Q4 10 6 10 L18 10 Q20 10 21 12 L23 16Z" stroke="currentColor" strokeWidth="2" />
      <motion.g
        animate={isOpen ? { rotateX: -70, y: -6 } : { rotateX: 0, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{ originX: "50%", originY: "100%", transformPerspective: 400 }}
      >
        <rect x="4" y="13" width="40" height="6" rx="2" fill="currentColor" opacity="0.3" />
        <rect x="4" y="13" width="40" height="6" rx="2" stroke="currentColor" strokeWidth="2" />
      </motion.g>
      <AnimatePresence>
        {isOpen && (
          <>
            {[-16, -5, 6].map((rotate, i) => (
              <motion.rect
                key={i}
                x="11" y="10" width="26" height="20" rx="2"
                fill="currentColor"
                opacity={0.85 - i * 0.22}
                initial={{ y: 0, rotate: 0, opacity: 0 }}
                animate={{ y: -(14 + i * 6), rotate, opacity: 0.85 - i * 0.22 }}
                exit={{ y: 0, rotate: 0, opacity: 0 }}
                transition={{ duration: 0.35, delay: i * 0.055, ease: [0.34, 1.56, 0.64, 1] }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </svg>
  );
}

/* ── Photo modal — border & struktur identik FolderModal di JourneySection ── */
function PhotoModal({
  item,
  onClose,
}: {
  item: AchievementItem;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const photos = item.galleryImages;
  const photo = photos[currentIndex];

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
        {/* Top shimmer — identik JourneySection */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        {/* Header — identik JourneySection */}
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
            <p className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
              {item.archiveLabel}
            </p>
            <h3 className="text-white font-bold text-sm leading-tight">{item.title}</h3>
          </div>
          <button
            onClick={() => { audioStore.playClickSound(); onClose(); }}
            className="ml-auto text-zinc-600 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Photo body — identik JourneySection */}
        <div className="p-4">
          {photo ? (
            <motion.div
              key={currentIndex}
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

          {/* Thumbnail nav — muncul jika foto lebih dari 1 */}
          {photos.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {photos.map((p, i) => (
                <button
                  key={i}
                  onClick={() => { audioStore.playClickSound(); setCurrentIndex(i); }}
                  className={`relative flex-shrink-0 w-16 h-10 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                    i === currentIndex ? "border-white" : "border-zinc-700 opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image src={p.src} alt={p.caption} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main section ── */
export default function AchievementsSection() {
  const { t } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const achievements = (t as any).achievements;
  const [activeDetail, setActiveDetail] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = activeDetail !== null ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [activeDetail]);

  const handleOpen = useCallback((i: number) => {
    audioStore.playClickSound();
    setActiveDetail(i);
  }, []);

  const handleClose = useCallback(() => setActiveDetail(null), []);

  return (
    <section
      id="achievements"
      className="py-24 sm:py-32 bg-[#0a0a0a]"
      style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
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
            {achievements.title}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-zinc-400 max-w-xl mb-16 leading-relaxed text-center mx-auto"
          >
            {achievements.subtitle}
          </motion.p>
        </motion.div>

        {/* Cards — border identik ProjectsSection */}
        <div className="space-y-8">
          {achievements.items.map((item: AchievementItem, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="group relative overflow-hidden bg-white dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-800/50 rounded-3xl hover:border-zinc-400 dark:hover:border-zinc-700 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_24px_50px_rgba(0,0,0,0.65)] active:translate-y-0 active:scale-[0.98] transition-all duration-500"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
                {/* LEFT: Info */}
                <div className="p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 border border-zinc-700 rounded-none text-[10px] font-bold tracking-[0.2em] text-zinc-400 mb-6">
                      {item.category}
                    </span>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-4 group-hover:translate-x-1 transition-transform duration-300">
                      {item.title}
                    </h3>

                    <p className="text-zinc-400 leading-relaxed mb-8 max-w-md">
                      {item.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {item.stats.map((stat, i) => (
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
                  </div>

                  {/* Buttons — tampilan asli ProjectsSection */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {/* Tombol "Lihat Detail" — tampilan asli, fungsi buka photo modal */}
                    <button
                      onClick={() => handleOpen(index)}
                      className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 border border-zinc-700 rounded-full text-xs sm:text-sm font-semibold text-white tracking-wider hover:bg-white/10 hover:border-zinc-500 transition-all duration-300"
                    >
                      {item.detail ?? item.archiveLabel}
                    </button>

                    {/* Tombol Live Demo */}
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-white text-black rounded-full text-xs sm:text-sm font-semibold tracking-wider hover:bg-zinc-200 transition-colors"
                    >
                      {achievements.liveDemo}
                      <ArrowUpRight size={14} className="animate-slide-diagonal" />
                    </a>
                  </div>
                </div>

                {/* RIGHT: Image — identik ProjectsSection, klik buka photo modal */}
                <div
                  className="relative h-64 lg:h-auto bg-zinc-900 border-t lg:border-t-0 lg:border-l border-zinc-800 overflow-hidden group/img cursor-pointer"
                  onClick={() => handleOpen(index)}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none z-10" />

                  <div className="absolute inset-0 z-20 flex items-center justify-center gap-4 opacity-0 group-hover/img:opacity-100 bg-black/40 md:backdrop-blur-sm transition-all duration-300">
                    <span
                      className="transform translate-y-4 group-hover/img:translate-y-0 transition-transform duration-300 delay-75 inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-bold tracking-wider rounded-full shadow-2xl hover:bg-zinc-200"
                    >
                      <ArrowUpRight size={16} className="animate-slide-diagonal" />
                      {item.detail ?? item.archiveLabel}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Photo Modal — border & tampilan identik FolderModal JourneySection */}
      <AnimatePresence>
        {activeDetail !== null && (
          <PhotoModal
            key={activeDetail}
            item={achievements.items[activeDetail]}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
