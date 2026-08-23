/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Copy, Check } from "lucide-react";
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

function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      title="Copy email"
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        flexShrink: 0,
      }}
      className={`flex items-center justify-center border transition-colors duration-300 cursor-pointer ${
        copied 
          ? "border-green-500/50 text-green-500 bg-green-500/10" 
          : "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] bg-zinc-900/50"
      }`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
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
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "b6671fcb-16bd-4af7-8c77-4540891c0a94", 
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: "Notifikasi Portfolio",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
      
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const socialLinks = [
    {
      label: "GitHub",
      href: "https://github.com/HanifHawari",
      // 🖼️ GIF — taruh file di: public/icons/social-github.gif
      gif: "/icons/social-github.gif",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/muhammad-hanif-hawari-868881327",
      // 🖼️ GIF — taruh file di: public/icons/social-linkedin.gif
      gif: "/icons/social-linkedin.gif",
    },
    {
      label: "Instagram",
      href: "https://www.instagram.com/haniefhawari_",
      // 🖼️ GIF — taruh file di: public/icons/social-instagram.gif
      gif: "/icons/social-instagram.gif",
    },
    {
      label: "Discord",
      href: "https://discord.com/users/bangneps", // Ganti dengan link/ID Discord kamu
      // 🖼️ GIF — taruh file di: public/icons/social-discord.gif
      gif: "/icons/social-discord.gif",
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
        >
          <motion.div variants={itemVariants} className="space-y-10">
            <div>
              <h3 className="text-sm font-bold tracking-[0.2em] text-zinc-500 uppercase mb-4">
                {t.contact.directEmail}
              </h3>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="group flex items-center justify-between p-3 border border-zinc-800 rounded-2xl hover:border-zinc-500 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-colors duration-300 bg-zinc-950/50"
              >
                <a
                  href={`mailto:${t.contact.email}`}
                  className="flex items-center gap-3 text-lg sm:text-xl font-bold text-white hover:text-zinc-200 transition-colors flex-1"
                >
                  <img 
                    src="/icons/mail.gif" 
                    alt="Mail" 
                    width={28} 
                    height={28} 
                    style={{ objectFit: "contain" }}
                  />
                  <span className="truncate">{t.contact.email}</span>
                </a>
                <CopyEmailButton email={t.contact.email} />
              </motion.div>
            </div>

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
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="group flex items-center gap-3 p-3 border border-zinc-800 rounded-2xl hover:border-zinc-500 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-colors duration-300 bg-zinc-950/50"
                  >
                    <span className="flex-shrink-0 w-9 h-9 flex items-center justify-center">
                      <img
                        src={link.gif}
                        alt={link.label}
                        width={32}
                        height={32}
                        style={{ objectFit: "contain" }}
                      />
                    </span>
                    <span className="text-zinc-400 group-hover:text-white font-medium transition-colors">
                      {link.label}
                    </span>
                    <span className="ml-auto text-zinc-700 group-hover:text-zinc-400 text-sm">
                      →
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="section-card p-8 transition-all duration-300">
              <div className="relative z-10">
                <form onSubmit={handleSubmit} className="space-y-5">
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
                      className="input-terminal placeholder-zinc-600"
                    />
                  </div>

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
                      className="input-terminal placeholder-zinc-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold tracking-[0.15em] text-zinc-500 uppercase mb-2">
                      {t.contact.form.subject}
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        className="input-terminal cursor-pointer w-full appearance-none pr-8"
                        style={{
                          WebkitAppearance: "none",
                          MozAppearance: "none",
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
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>

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
                      className="input-terminal placeholder-zinc-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black rounded-full text-sm font-bold tracking-[0.15em] hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {t.contact.form.sending}
                      </>
                    ) : (
                      <>
                        <Send size={14} className="animate-slide-diagonal" />
                        {t.contact.form.send}
                      </>
                    )}
                  </button>

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
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
