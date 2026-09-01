/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState, useEffect, ElementType } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Download, MapPin, Cpu, Terminal, Target } from "lucide-react";
import { 
  SiHtml5, SiCss, SiPhp, SiJavascript, SiLaravel, SiNextdotjs, 
  SiReact, SiCapacitor, SiTailwindcss, SiBootstrap, SiVite, 
  SiGit, SiNotion, SiGithub, SiFigma, SiPostman
} from "react-icons/si";
import { FaJava, FaDatabase } from "react-icons/fa";

const techIcons: Record<string, { icon: ElementType, color: string }> = {
  "HTML5": { icon: SiHtml5, color: "#E34F26" },
  "CSS3": { icon: SiCss, color: "#1572B6" },
  "PHP": { icon: SiPhp, color: "#777BB4" },
  "Java": { icon: FaJava, color: "#5382a1" },
  "JavaScript": { icon: SiJavascript, color: "#F7DF1E" },
  "SQL": { icon: FaDatabase, color: "#4479A1" },
  "Laravel": { icon: SiLaravel, color: "#FF2D20" },
  "Next.js": { icon: SiNextdotjs, color: "#ffffff" },
  "React": { icon: SiReact, color: "#61DAFB" },
  "Capacitor": { icon: SiCapacitor, color: "#119EFF" },
  "Tailwind": { icon: SiTailwindcss, color: "#06B6D4" },
  "Bootstrap": { icon: SiBootstrap, color: "#7952B3" },
  "Vite": { icon: SiVite, color: "#646CFF" },
  "Git": { icon: SiGit, color: "#F05032" },
  "Notion": { icon: SiNotion, color: "#ffffff" },
  "GitHub": { icon: SiGithub, color: "#ffffff" },
  "Figma": { icon: SiFigma, color: "#F24E1E" },
  "Postman": { icon: SiPostman, color: "#FF6C37" },
};
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
  const sceneRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isHolding = useRef(false);
  const [gloss, setGloss] = useState({ x: 50, y: 50 });
  const [hovering, setHovering] = useState(false);

  const getRotation = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current) return { rotateX: 0, rotateY: 0 };
    const rect = sceneRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 30;
    const rotateX = ((y / rect.height) - 0.5) * -30;
    return { rotateX, rotateY };
  };

  const applyTilt = (e: React.MouseEvent<HTMLDivElement>, extraTransform = '') => {
    if (!cardRef.current) return;
    const { rotateX, rotateY } = getRotation(e);
    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)${extraTransform}`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = isHolding.current 
      ? 'transform 0.05s linear' 
      : 'transform 0.15s ease-out';
    applyTilt(e, isHolding.current ? ' scale(1.05) translateY(-4px)' : '');

    if (sceneRef.current) {
      const rect = sceneRef.current.getBoundingClientRect();
      setGloss({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    isHolding.current = true;
    cardRef.current.style.transition = 'transform 0.05s linear';
    applyTilt(e, ' scale(1.05) translateY(-4px)');
  };

  const jump = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
    cardRef.current.style.transform = 'translateY(-28px) scale(1.08) rotateX(0deg) rotateY(0deg)';
    
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateY(0px) scale(1) rotateX(0deg) rotateY(0deg)';
      }
    }, 260);
  };

  const handleMouseUp = () => {
    if (!isHolding.current) return;
    isHolding.current = false;
    jump();
  };

  const handleMouseLeave = () => {
    isHolding.current = false;
    setHovering(false);
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  const handleMouseEnter = () => {
    setHovering(true);
  };

  return (
    <div
      ref={sceneRef}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ perspective: 900, minHeight: 0 }}
    >
      <div
        ref={cardRef}
        style={{ transformStyle: "preserve-3d" }}
        className="w-full h-full overflow-hidden relative section-card select-none"
      >
        <Image
          src="/profile.png"
          alt="Profile"
          fill
          quality={100}
          unoptimized={true}
          className="object-contain pointer-events-none" style={{ backgroundColor: '#c8ccd5' }}
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
          className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between z-20 transition-colors pointer-events-auto"
          style={{
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
      </div>
    </div>
  );
}

function TechPill({ label }: { label: string }) {
  const iconData = techIcons[label];
  const Icon = iconData?.icon;

  return (
    <motion.span
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      className="px-3 py-1 rounded-full border border-zinc-700 text-xs font-medium tracking-wider text-zinc-300 hover:text-white hover:border-zinc-500 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-colors duration-300 cursor-default bg-zinc-900/50 flex items-center gap-2 w-max"
    >
      {Icon && (
        <span style={{ display: "inline-flex", alignItems: "center", color: iconData.color }}>
          <Icon size={14} />
        </span>
      )}
      {label}
    </motion.span>
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
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group/item status-bar-item py-4 px-4 sm:px-6 flex items-center gap-2 sm:gap-3 transition-colors duration-300 hover:bg-white/5 cursor-default"
        >
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
          </span>
          <span className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] text-white uppercase whitespace-nowrap transition-colors group-hover/item:text-green-400">
            {t.hero.openToWork}
          </span>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group/item status-bar-item py-4 px-3 sm:px-6 flex items-center transition-colors duration-300 hover:bg-white/5 cursor-default"
        >
          <span className="text-[9px] sm:text-[10px] font-black tracking-[0.1em] sm:tracking-[0.2em] text-zinc-500 uppercase overflow-hidden text-ellipsis transition-colors group-hover/item:text-white" style={{ maxWidth: '100%' }}>
            {t.hero.basedIn}
          </span>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group/item status-bar-item py-4 px-3 sm:px-6 flex items-center gap-2 border-t border-zinc-800 lg:border-t-0 transition-colors duration-300 hover:bg-white/5 cursor-default"
        >
          <span className="text-[9px] sm:text-[10px] font-black tracking-[0.1em] sm:tracking-[0.2em] text-white uppercase whitespace-nowrap transition-colors">
            {t.hero.today} <span className="text-zinc-500 font-medium ml-1 transition-colors group-hover/item:text-white">{dateStr}</span>
          </span>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="group/item status-bar-item py-4 px-4 sm:px-6 flex items-center justify-between gap-3 border-t border-zinc-800 lg:border-t-0 transition-colors duration-300 hover:bg-white/5 cursor-default"
        >
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
        </motion.div>
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
                  href="/cv.pdf" target="_blank" rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-white text-sm font-semibold tracking-wider hover:bg-white hover:text-black transition-all duration-300 btn-glow"
                >
                  <Download size={15} className="animate-bounce" />
                  {t.about.downloadResume}
                </a>
              </div>
            </SectionCard>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-stretch justify-center lg:justify-end w-full">
            <div className="w-full min-h-[420px] sm:min-h-[480px]">
              <IDCard t={t} />
            </div>
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
                  <motion.span 
                    key={i} 
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className="px-3 py-1 rounded-full border border-zinc-700 text-xs font-medium tracking-wider text-zinc-300 hover:text-white hover:border-zinc-500 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-colors duration-300 cursor-default bg-zinc-900/50"
                  >
                    {tag}
                  </motion.span>
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
                {[t.about.techStack.core, t.about.techStack.frameworks, t.about.techStack.tools].map((cat, ci) => (
                  <div key={ci}>
                    <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--text-subtle)", marginBottom: 6 }}>
                      {cat.title}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {cat.items.map((item, i) => (
                        <TechPill key={i} label={item} />
                      ))}
                    </div>
                  </div>
                ))}
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
                      className={i > 0 ? "dark:invert dark:hue-rotate-180" : ""}
                      style={{
                        flexShrink: 0,
                        marginTop: 2,
                        objectFit: "contain",
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
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Target size={18} className="text-zinc-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                </motion.div>
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {language === "id" ? "FOKUS SAYA" : "FOCUS AREAS"}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((area, i) => (
                  <motion.span
                    key={i}
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    className="px-3 py-1 rounded-full border border-zinc-700 text-xs font-medium tracking-wider text-zinc-300 hover:text-white hover:border-zinc-500 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-colors duration-300 cursor-default bg-zinc-900/50"
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
