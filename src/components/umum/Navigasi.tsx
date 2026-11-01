"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/KonteksBahasa";
import { useTheme } from "@/lib/KonteksTema";
import Logo from "@/components/umum/Logo";
import { useBodyScrollLock, useEscapeKey } from "@/lib/modal";

const navLinks = [
  { key: "home", href: "#home" },
  { key: "about", href: "#about" },
  { key: "projects", href: "#projects" },
  { key: "achievements", href: "#achievements" },
  { key: "journey", href: "#journey" },
  { key: "contact", href: "#contact" },
] as const;

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

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
  const closeMobileMenu = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    const handleResize = () => {
      // The drawer has no close button on desktop widths, so don't leave it open there
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll(); // A reload can restore a scrolled position without firing a scroll event
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useBodyScrollLock(mobileOpen);
  useEscapeKey(mobileOpen, closeMobileMenu);

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
      {/* Fixed on every screen size so the menu is always reachable. Once the page is scrolled,
          the full-width bar gets a backdrop so the links stay readable over the content.
          zIndex 60 keeps the toggle above the drawer (50) and backdrop (40). */}
      <div
        className="fixed"
        style={{
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          display: "flex",
          justifyContent: "center",
          // Transparent at the top, so clicks beside the links reach the hero; once the bar is
          // solid it blocks them, otherwise a click on its edge would hit the content beneath
          pointerEvents: scrolled ? "auto" : "none",
          background: scrolled ? (isDark ? "rgba(10,10,10,0.85)" : "rgba(240,240,240,0.9)") : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: `1px solid ${scrolled ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)") : "transparent"}`,
          transition: "background-color 0.5s ease, backdrop-filter 0.5s ease, border-color 0.5s ease",
        }}
      >
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          pointerEvents: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 1280,
          height: 64,
          padding: "0 24px",
          border: "1px solid transparent",
        }}
      >
        <button
            onClick={() => handleNavClick("#home")}
            aria-label="Home"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--foreground)", display: "flex", alignItems: "center" }}
          >
            <Logo variant="monogram" />
          </button>



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

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <motion.button
              onClick={() => { toggleTheme(); }}
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
                  onClick={() => { setLanguage("en"); }}
                  className={`lang-pill-btn ${language === "en" ? "active" : "inactive"}`}
                >
                  US
                </button>
                <button
                  onClick={() => { setLanguage("id"); }}
                  className={`lang-pill-btn ${language === "id" ? "active" : "inactive"}`}
                >
                  ID
                </button>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              style={{ background: "none", border: "none", color: "var(--foreground)", cursor: "pointer", padding: 4 }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
      </motion.nav>
    </div>

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

                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.08 }}
                  style={{ marginTop: 16 }}
                >
                  <div className="lang-pill" style={{ display: "inline-flex" }}>
                    <button
                      onClick={() => { setLanguage("en"); }}
                      className={`lang-pill-btn ${language === "en" ? "active" : "inactive"}`}
                      style={{ fontSize: 14, padding: "8px 20px" }}
                    >
                      US
                    </button>
                    <button
                      onClick={() => { setLanguage("id"); }}
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
