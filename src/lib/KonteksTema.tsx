"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Returns true when the viewport is in mobile range (< 768px) */
function isMobileViewport(): boolean {
  return typeof window !== "undefined" && window.innerWidth < 768;
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  if (t === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isMobile = isMobileViewport();

    if (isMobile) {
      // Mobile: always lock to dark
      setTheme("dark");
      applyTheme("dark");
    } else {
      // Desktop: restore saved preference
      const saved = localStorage.getItem("portfolio-theme") as Theme;
      const initial = saved === "light" || saved === "dark" ? saved : "dark";
      setTheme(initial);
      applyTheme(initial);
    }

    // Listen for viewport resize so switching desktop→mobile auto-locks to dark
    const handleResize = () => {
      if (isMobileViewport()) {
        setTheme("dark");
        applyTheme("dark");
      } else {
        const saved = localStorage.getItem("portfolio-theme") as Theme;
        const restored = saved === "light" || saved === "dark" ? saved : "dark";
        setTheme(restored);
        applyTheme(restored);
      }
    };

    window.addEventListener("resize", handleResize);
    setMounted(true);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    // Only allow toggle on desktop
    if (isMobileViewport()) return;
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("portfolio-theme", next);
    applyTheme(next);
  };

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
