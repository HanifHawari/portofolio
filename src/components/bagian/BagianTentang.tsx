"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Download, MapPin, Cpu, Terminal, Target } from "lucide-react";
import { useLanguage } from "@/lib/KonteksBahasa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function IDCard({ t }: { t: { about: { name: string; discordUser: string; online: string; hireMe: string } } }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [gloss, setGloss] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -10, y: dx * 10 });
    setGloss({ x: (e.clientX - rect.left) / rect.width * 100, y: (e.clientY - rect.top) / rect.height * 100 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); setTilt({ x: 0, y: 0 }); setGloss({ x: 50, y: 50 }); }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y, scale: hovering ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 800 }}
      className="animate-float w-full h-[320px] sm:h-[400px] rounded-[32px] overflow-hidden relative shadow-2xl border border-zinc-700 bg-zinc-900"
    >
      <Image
        src="/profile.jpg"
        alt="Profile"
        fill
        className="object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {hovering && (
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at ${gloss.x}% ${gloss.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          pointerEvents: "none", zIndex: 10,
        }} />
      )}

      <div
        className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between z-20 transition-colors"
        style={{
          transform: "translateZ(30px)",
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border)"
        }}
      >
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-sm sm:text-base tracking-wide" style={{ color: "var(--foreground)" }}>
            {t.about.discordUser}
          </h3>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
              {t.about.online}
            </span>
          </div>
        </div>

        <a
          href="#contact"
          className="px-5 py-2 text-[10px] font-bold tracking-[0.15em] uppercase transition-colors rounded-lg"
          style={{
            backgroundColor: "var(--foreground)",
            color: "var(--background)",
            border: "1px solid var(--background)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--text-muted)";
            e.currentTarget.style.color = "var(--background)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--foreground)";
            e.currentTarget.style.color = "var(--background)";
          }}
        >
          {t.about.hireMe}
        </a>
      </div>
    </motion.div>
  );
}

function TechPill({ label, index = 0 }: { label: string; index?: number }) {
  return (
    <span
      className="group hover:border-zinc-600 hover:text-white tech-wave-anim"
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "6px 14px",
        border: "1px solid var(--border-strong)",
        background: "var(--surface-2)",
        fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
        color: "var(--text-secondary)", borderRadius: 9999, whiteSpace: "nowrap",
        transition: "border-color 0.2s ease, color 0.2s ease", cursor: "default",
        "--wave-index": index,
      } as React.CSSProperties}
    >
      {label}
    </span>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`section-card p-6 sm:p-8 ${className}`}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

function StatusBar() {
  const { t, language } = useLanguage();
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const now = new Date();
    const day = now.getDate();
    const months = language === 'id'
      ? ["JAN", "PEB", "MAR", "APR", "MEI", "JUN", "JUL", "AGU", "SEP", "OKT", "NOP", "DES"]
      : ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    setDateStr(`${day} ${month} ${year}`);
  }, [language]);

  return (
    <div className="w-full border-t border-b border-zinc-800 bg-zinc-950/20 backdrop-blur-sm overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-zinc-800 border-x border-zinc-800">
        <div className="group/item status-bar-item py-4 px-4 sm:px-6 flex items-center gap-2 sm:gap-3 transition-all duration-300 hover:bg-white/5 cursor-default hover:scale-[1.02]">
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          </span>
          <span className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-white uppercase whitespace-nowrap transition-colors group-hover/item:text-green-400">
            {t.hero.openToWork}
          </span>
        </div>

        <div className="group/item status-bar-item py-4 px-3 sm:px-6 flex items-center transition-all duration-300 hover:bg-white/5 cursor-default hover:scale-[1.02]">
          <span className="text-[9px] sm:text-[10px] font-black tracking-[0.1em] sm:tracking-[0.2em] text-zinc-500 uppercase overflow-hidden text-ellipsis transition-colors group-hover/item:text-white" style={{ maxWidth: '100%' }}>
            {t.hero.basedIn}
          </span>
        </div>

        <div className="group/item status-bar-item py-4 px-3 sm:px-6 flex items-center gap-2 border-t border-zinc-800 lg:border-t-0 transition-all duration-300 hover:bg-white/5 cursor-default hover:scale-[1.02]">
          <span className="text-[9px] sm:text-[10px] font-black tracking-[0.1em] sm:tracking-[0.2em] text-white uppercase whitespace-nowrap transition-colors">
            {t.hero.today} <span className="text-zinc-500 font-medium ml-1 transition-colors group-hover/item:text-white">{dateStr}</span>
          </span>
        </div>

        <div className="group/item status-bar-item py-4 px-4 sm:px-6 flex items-center justify-between gap-3 border-t border-zinc-800 lg:border-t-0 transition-all duration-300 hover:bg-white/5 cursor-default hover:scale-[1.02]">
          <span className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase whitespace-nowrap transition-colors group-hover/item:text-white">
            {t.hero.scrollDown}
          </span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-zinc-500 text-xs transition-colors group-hover/item:text-white"
          >
            ↓
          </motion.span>
        </div>
      </div>
    </div>
  );
}

export default function AboutSection() {
  const { t, language } = useLanguage();

  const philosophyItems = language === "id"
    ? [
      { icon: "</>", title: "Kode Bersih", desc: "Saya memprioritaskan keterbacaan dan pemeliharaan code di atas segalanya." },
      { icon: "{ }", title: "Berfokus pada Pengguna", desc: "Setiap keputusan desain dimulai dari perspektif pengguna akhir." },
      { icon: "/>", title: "Kirim & Iterasi", desc: "Saya percaya dalam merilis cepat, belajar, dan meningkatkan secara berkelanjutan." },
    ]
    : [
      { icon: "</>", title: "Clean Code", desc: "I prioritize readability and maintainability above all." },
      { icon: "{ }", title: "User-Focused", desc: "Every design decision starts from the end-user's perspective." },
      { icon: "/>", title: "Ship & Iterate", desc: "I believe in releasing fast, learning, and continuously improving." },
    ];

  const focusAreas = ["Frontend Development", "UI/UX Design", "React & Next.js", "Mobile-first", "Performance"];

  return (
    <section id="about" className="bg-[#0a0a0a]">
      <StatusBar />
      <div className="max-w-7xl mx-auto px-6 py-24 sm:py-32">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
            {t.about.title}
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8"
        >
          <motion.div variants={itemVariants}>
            <SectionCard>
              <div className="space-y-5">
                <h2 className="text-2xl sm:text-4xl font-bold text-white flex items-center gap-2">
                  {/* 🖼️ GIF — taruh file di: public/icons/wave.gif */}
                  <img src="/icons/wave.gif" alt="wave" width={36} height={36} style={{ display: "inline-block", verticalAlign: "middle" }} />
                  <span>
                    {t.about.hi}{""}<span className="text-white">{t.about.name}</span>
                  </span>
                </h2>
                <p className="text-zinc-400 leading-relaxed text-sm">{t.about.bio1}</p>
                <p className="text-zinc-400 leading-relaxed text-sm">{t.about.bio2}</p>
                <a
                  href="/cv.pdf" download
                  className="group inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-white text-sm font-semibold tracking-wider hover:bg-white hover:text-black transition-all duration-300 btn-glow"
                >
                  <Download size={15} className="animate-bounce" />
                  {t.about.downloadResume}
                </a>
              </div>
            </SectionCard>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-start justify-center lg:justify-end">
            <IDCard t={t} />
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8"
        >
          <motion.div variants={itemVariants}>
            <SectionCard className="h-full">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 border border-zinc-700 text-xs font-semibold tracking-wider text-white">
                  {t.about.education.year}
                </span>
                <span className="px-3 py-1 bg-zinc-800 text-xs font-semibold tracking-wider text-zinc-300">
                  {t.about.education.badge}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mb-1 flex items-center gap-2">
                {t.about.education.title}
                  {/* 🖼️ GIF — taruh file di: public/icons/graduate.gif */}
                  <img src="/icons/graduate.gif" alt="graduate" width={28} height={28} style={{ display: "inline-block", verticalAlign: "middle" }} />
              </h3>
              <div className="flex items-center gap-2 text-zinc-500 text-sm mb-3">
                <MapPin size={14} />
                <span>{t.about.education.university}</span>
              </div>
              <p className="text-zinc-400 leading-relaxed mb-4 text-sm">
                {t.about.education.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.about.education.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 rounded-full border border-zinc-700 text-xs font-medium tracking-wider text-zinc-300">
                    {tag}
                  </span>
                ))}
              </div>
            </SectionCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SectionCard className="h-full">
              <div className="flex items-center gap-2 mb-4">
                <Cpu size={16} className="text-zinc-400" />
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase">
                  {t.about.techStack.title}
                </h3>
              </div>
              <div className="space-y-4">
                {(() => {
                  let globalIndex = 0;
                  return [t.about.techStack.core, t.about.techStack.frameworks, t.about.techStack.tools].map((cat, ci) => (
                    <div key={ci}>
                      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-subtle)", marginBottom: 6 }}>
                        {cat.title}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {cat.items.map((item, i) => {
                          const currentIndex = globalIndex++;
                          return <TechPill key={i} label={item} index={currentIndex} />;
                        })}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </SectionCard>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div variants={itemVariants}>
            <SectionCard className="h-full">
              <div className="flex items-center gap-2 mb-4">
                <Terminal size={16} className="text-zinc-400" />
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {language === "id" ? "FILOSOFI KERJA" : "WORK PHILOSOPHY"}
                </h3>
              </div>
              <div className="space-y-3">
                {philosophyItems.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    {/* 🖼️ GIF ICON — taruh file GIF kamu di: public/icons/philosophy-{i+1}.gif
                        Contoh: public/icons/philosophy-1.gif, philosophy-2.gif, philosophy-3.gif */}
                    <img
                      src={`/icons/philosophy-${i + 1}.gif`}
                      alt={item.title}
                      width={44}
                      height={44}
                      style={{
                        flexShrink: 0,
                        marginTop: 2,
                        objectFit: "contain",
                        // Ganti ukuran di sini jika GIF kamu lebih besar/kecil
                      }}
                    />
                    <div>
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SectionCard className="h-full">
              <div className="flex items-center gap-2 mb-4">
                <Target size={16} className="text-zinc-400" />
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {language === "id" ? "FOKUS SAYA" : "FOCUS AREAS"}
                </h3>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {focusAreas.map((area, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="tech-wave-anim"
                    style={{
                      display: "inline-flex", padding: "5px 16px",
                      border: "1px solid var(--border-strong)",
                      fontSize: 12, fontWeight: 500,
                      color: "var(--text-secondary)", letterSpacing: "0.05em",
                      borderRadius: 9999,
                      cursor: "default",
                      transition: "border-color 0.2s ease, color 0.2s ease",
                      "--wave-index": i,
                    } as React.CSSProperties}
                  >
                    {area}
                  </motion.span>
                ))}
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border-strong)" }}>
                <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.6 }}>
                  {language === "id"
                    ? "Terus belajar dan beradaptasi dengan teknologi terbaru untuk memberikan solusi terbaik."
                    : "Constantly learning and adapting to the latest technologies to deliver the best solutions."}
                </p>
              </div>
            </SectionCard>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
