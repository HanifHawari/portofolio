"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import Logo from "./Logo";


const navLinks = [
  { key: "home", href: "#home" },
  { key: "about", href: "#about" },
  { key: "projects", href: "#projects" },
  { key: "journey", href: "#journey" },
  { key: "contact", href: "#contact" },
] as const;

// Ikon matahari (mode terang)
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

// Ikon bulan (mode gelap)
function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isDark = theme === "dark";

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "background 0.3s ease, border-color 0.3s ease",
          background: scrolled
            ? isDark
              ? "rgba(10,10,10,0.85)"
              : "rgba(240,240,240,0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`
            : "1px solid transparent",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button
            onClick={() => handleNavClick("#home")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--foreground)", display: "flex", alignItems: "center" }}
          >
            <Logo variant="monogram" />
          </button>


          {/* Menu Desktop */}
          <div style={{ alignItems: "center", gap: 32 }} className="hidden md:flex">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.href)}
                className="nav-link"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-muted)",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--foreground)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {t.nav[link.key as keyof typeof t.nav]}
              </button>
            ))}
          </div>

          {/* Tema, Bahasa, dan Menu Mobile */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

            <motion.button
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              className="theme-toggle-btn"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.span
                    key="sun"
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <SunIcon />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <MoonIcon />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>


            <div className="hidden md:flex">
              <div className="lang-pill">
                <button
                  onClick={() => setLanguage("en")}
                  className={`lang-pill-btn ${language === "en" ? "active" : "inactive"}`}
                >
                  US
                </button>
                <button
                  onClick={() => setLanguage("id")}
                  className={`lang-pill-btn ${language === "id" ? "active" : "inactive"}`}
                >
                  ID
                </button>
              </div>
            </div>

            {/* Menu hamburger mobile */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--foreground)",
                padding: 4,
              }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Drawer mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 40 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                height: "100%",
                width: 280,
                background: "var(--background)",
                borderLeft: "1px solid var(--border-strong)",
                zIndex: 50,
                padding: "80px 32px 32px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.key}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => handleNavClick(link.href)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 18,
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {t.nav[link.key as keyof typeof t.nav]}
                  </motion.button>
                ))}

                {/* Ganti bahasa mobile */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.08 }}
                  style={{ marginTop: 16 }}
                >
                  <div className="lang-pill" style={{ display: "inline-flex" }}>
                    <button
                      onClick={() => setLanguage("en")}
                      className={`lang-pill-btn ${language === "en" ? "active" : "inactive"}`}
                      style={{ fontSize: 14, padding: "8px 20px" }}
                    >
                      US
                    </button>
                    <button
                      onClick={() => setLanguage("id")}
                      className={`lang-pill-btn ${language === "id" ? "active" : "inactive"}`}
                      style={{ fontSize: 14, padding: "8px 20px" }}
                    >
                      ID
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
