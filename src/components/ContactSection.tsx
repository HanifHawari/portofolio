"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Loader2, Copy, Check } from "lucide-react";
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

function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.9 }}
      title="Copy email"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "6px 12px",
        border: "1px solid var(--border-strong)",
        background: copied ? "rgba(34,197,94,0.1)" : "var(--surface-2)",
        color: copied ? "#22c55e" : "var(--text-muted)",
        borderColor: copied ? "rgba(34,197,94,0.4)" : "var(--border-strong)",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.08em",
        cursor: "pointer",
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </motion.button>
  );
}

export default function ContactSection() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // EmailJS integration placeholder
      // Replace with your actual EmailJS credentials:
      // import emailjs from '@emailjs/browser';
      // await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData, 'YOUR_PUBLIC_KEY');
      
      // Simulate send for now
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const socialLinks = [
    {
      label: "GitHub",
      href: "https://github.com/yourusername",
      svg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/yourusername",
      svg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: "https://instagram.com/yourusername",
      svg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
  ];

  return (
    <section id="contact" className="py-24 sm:py-32 bg-[#0a0a0a]">
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
            {t.contact.title}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-zinc-400 max-w-xl mb-16 leading-relaxed"
          >
            {t.contact.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16"
        >
          {/* Left: Direct contact */}
          <motion.div variants={itemVariants} className="space-y-10">
            {/* Email */}
            <div>
              <h3 className="text-sm font-bold tracking-[0.2em] text-zinc-500 uppercase mb-4">
                {t.contact.directEmail}
              </h3>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${t.contact.email}`}
                  className="group flex items-center gap-3 text-xl sm:text-2xl font-bold text-white hover:text-zinc-300 transition-colors"
                >
                  <Mail size={20} className="text-zinc-500 group-hover:text-white transition-colors" />
                  {t.contact.email}
                </a>
                <CopyEmailButton email={t.contact.email} />
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-sm font-bold tracking-[0.2em] text-zinc-500 uppercase mb-4">
                {t.contact.socialLinks}
              </h3>
              <div className="space-y-3">
                {socialLinks.map((link, i) => (
                  <motion.a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group flex items-center gap-3 p-3 border border-zinc-800 hover:border-zinc-600 transition-all"
                  >
                    <span className="text-zinc-500 group-hover:text-white transition-colors">
                      {link.svg}
                    </span>
                    <span className="text-zinc-400 group-hover:text-white font-medium transition-colors">
                      {link.label}
                    </span>
                    <span className="ml-auto text-zinc-700 group-hover:text-zinc-400 transition-colors text-sm">
                      →
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div variants={itemVariants}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold tracking-[0.15em] text-zinc-500 uppercase mb-2">
                  {t.contact.form.name}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t.contact.form.namePlaceholder}
                  className="w-full px-4 py-3 bg-transparent border border-zinc-700 text-white text-sm placeholder-zinc-600 focus:border-white transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold tracking-[0.15em] text-zinc-500 uppercase mb-2">
                  {t.contact.form.email}
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder={t.contact.form.emailPlaceholder}
                  className="w-full px-4 py-3 bg-transparent border border-zinc-700 text-white text-sm placeholder-zinc-600 focus:border-white transition-colors"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold tracking-[0.15em] text-zinc-500 uppercase mb-2">
                  {t.contact.form.subject}
                </label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-transparent border border-zinc-700 text-white text-sm focus:border-white transition-colors appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2371717a' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 12px center",
                  }}
                >
                  <option value="" disabled className="bg-zinc-900">
                    Select a subject
                  </option>
                  {t.contact.form.subjects.map((subject, i) => (
                    <option key={i} value={subject} className="bg-zinc-900">
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold tracking-[0.15em] text-zinc-500 uppercase mb-2">
                  {t.contact.form.message}
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder={t.contact.form.messagePlaceholder}
                  className="w-full px-4 py-3 bg-transparent border border-zinc-700 text-white text-sm placeholder-zinc-600 focus:border-white transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black text-sm font-bold tracking-[0.15em] hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all btn-glow"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {t.contact.form.sending}
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    {t.contact.form.send}
                  </>
                )}
              </button>

              {/* Status messages */}
              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-sm text-center"
                >
                  {t.contact.form.success}
                </motion.p>
              )}
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center"
                >
                  {t.contact.form.error}
                </motion.p>
              )}
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
