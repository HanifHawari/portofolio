"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Download, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

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

// ── 3D Tilt ID Card ──────────────────────────────────────────────────────────
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
      className="animate-float w-full h-[320px] sm:h-[400px] rounded-[32px] overflow-hidden relative shadow-2xl border border-zinc-800 bg-zinc-900"
    >
      {/* Full Background Image */}
      <img 
        src="/profile.jpg" 
        alt="Profile" 
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Subtle bottom gradient to ensure the pill stands out */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

      {/* Gloss overlay */}
      {hovering && (
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(circle at ${gloss.x}% ${gloss.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          pointerEvents: "none", zIndex: 10,
        }} />
      )}

      {/* Floating Dark Pill Overlay at the bottom */}
      <div 
        className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between z-20"
        style={{ transform: "translateZ(30px)" }}
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-white font-bold text-sm sm:text-base tracking-wide">
            {t.about.discordUser}
          </h3>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-zinc-400 text-[10px] font-bold tracking-[0.2em] uppercase">
              {t.about.online}
            </span>
          </div>
        </div>

        <a 
          href="#contact"
          className="px-5 py-2 bg-white text-black text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-zinc-200 transition-colors rounded-lg"
        >
          {t.about.hireMe}
        </a>
      </div>
    </motion.div>
  );
}

// ── Compact tech pill ─────────────────────────────────────────────────────────
function TechPill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center",
        padding: "3px 10px",
        border: "1px solid var(--border-strong)",
        background: "var(--surface-2)",
        fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
        color: "var(--text-secondary)", borderRadius: 4, whiteSpace: "nowrap",
        transition: "border-color 0.2s, color 0.2s", cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--text-muted)"; el.style.color = "var(--foreground)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border-strong)"; el.style.color = "var(--text-secondary)";
      }}
    >
      {label}
    </span>
  );
}

// ── Bordered section card ─────────────────────────────────────────────────────
function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`border border-zinc-800 bg-zinc-950/50 p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
}

// ── Label tag ─────────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <span style={{
      display: "inline-block",
      fontSize: 11, fontWeight: 700, letterSpacing: "0.2em",
      textTransform: "uppercase" as const, color: "var(--text-muted)",
      borderBottom: "1px solid var(--border-strong)", paddingBottom: 6,
    }}>
      {text}
    </span>
  );
}

export default function AboutSection() {
  const { t, language } = useLanguage();

  const philosophyItems = language === "id"
    ? [
        { icon: "⚡", title: "Kode Bersih", desc: "Saya memprioritaskan keterbacaan dan pemeliharaan code di atas segalanya." },
        { icon: "🎯", title: "Berfokus pada Pengguna", desc: "Setiap keputusan desain dimulai dari perspektif pengguna akhir." },
        { icon: "🚀", title: "Kirim & Iterasi", desc: "Saya percaya dalam merilis cepat, belajar, dan meningkatkan secara berkelanjutan." },
      ]
    : [
        { icon: "⚡", title: "Clean Code", desc: "I prioritize readability and maintainability above all." },
        { icon: "🎯", title: "User-Focused", desc: "Every design decision starts from the end-user's perspective." },
        { icon: "🚀", title: "Ship & Iterate", desc: "I believe in releasing fast, learning, and continuously improving." },
      ];

  const focusAreas = ["Frontend Development", "UI/UX Design", "React & Next.js", "Mobile-first", "Performance"];

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <SectionLabel text={language === "id" ? "TENTANG SAYA" : "ABOUT"} />
        </motion.div>

        {/* ── Bio + ID Card */}
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
                <div className="text-4xl sm:text-5xl">{t.about.greeting}</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {t.about.hi}{" "}<span className="text-white">{t.about.name}</span>
                </h2>
                <p className="text-zinc-400 leading-relaxed text-sm">{t.about.bio1}</p>
                <p className="text-zinc-400 leading-relaxed text-sm">{t.about.bio2}</p>
                <p className="text-zinc-400 leading-relaxed text-sm">{t.about.bio3}</p>
                <a
                  href="/cv.pdf" download
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-white text-sm font-semibold tracking-wider hover:bg-white hover:text-black transition-all duration-300 btn-glow"
                >
                  <Download size={15} />
                  {t.about.downloadResume}
                </a>
              </div>
            </SectionCard>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-start justify-center lg:justify-end">
            <IDCard t={t} />
          </motion.div>
        </motion.div>

        {/* ── Education Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mb-8"
        >
          <motion.div variants={itemVariants}>
            <SectionCard>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 border border-zinc-700 text-xs font-semibold tracking-wider text-white">
                  {t.about.education.year}
                </span>
                <span className="px-3 py-1 bg-zinc-800 text-xs font-semibold tracking-wider text-zinc-300">
                  {t.about.education.badge}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">
                {t.about.education.title}
              </h3>
              <div className="flex items-center gap-2 text-zinc-500 text-sm mb-4">
                <MapPin size={14} />
                <span>{t.about.education.university}</span>
              </div>
              <p className="text-zinc-400 leading-relaxed mb-5 max-w-2xl text-sm">
                {t.about.education.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {t.about.education.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 border border-zinc-700 text-xs font-medium tracking-wider text-zinc-300">
                    {tag}
                  </span>
                ))}
              </div>
            </SectionCard>
          </motion.div>
        </motion.div>

        {/* ── Tech Stack (compact pills) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="mb-8"
        >
          <motion.div variants={itemVariants}>
            <SectionCard>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
                {t.about.techStack.title}
              </p>
              <div className="space-y-5">
                {[t.about.techStack.core, t.about.techStack.frameworks, t.about.techStack.tools].map((cat, ci) => (
                  <div key={ci}>
                    <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-subtle)", marginBottom: 8 }}>
                      {cat.title}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {cat.items.map((item, i) => <TechPill key={i} label={item} />)}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </motion.div>
        </motion.div>

        {/* ── Work Philosophy + Focus Areas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div variants={itemVariants}>
            <SectionCard className="h-full">
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
                {language === "id" ? "FILOSOFI KERJA" : "WORK PHILOSOPHY"}
              </p>
              <div className="space-y-5">
                {philosophyItems.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{item.icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                      <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <SectionCard className="h-full">
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 20 }}>
                {language === "id" ? "FOKUS SAYA" : "FOCUS AREAS"}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {focusAreas.map((area, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    style={{
                      display: "inline-flex", padding: "8px 16px",
                      border: "1px solid var(--border-strong)",
                      fontSize: 13, fontWeight: 500,
                      color: "var(--text-secondary)", letterSpacing: "0.05em",
                    }}
                  >
                    {area}
                  </motion.span>
                ))}
              </div>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border-strong)" }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>
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
