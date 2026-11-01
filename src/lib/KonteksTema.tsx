"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useIsClient } from "./useIsClient";

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

/** Mobile is always dark; desktop restores the saved preference. */
function preferredTheme(): Theme {
  if (isMobileViewport()) return "dark";
  return localStorage.getItem("portfolio-theme") === "light" ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // "dark" on the server and during hydration, matching the server HTML. The inline
  // script in layout.tsx has already applied the real theme to <html>.
  const isClient = useIsClient();
  const [chosen, setChosen] = useState<Theme | null>(null);
  const theme = chosen ?? (isClient ? preferredTheme() : "dark");

  useEffect(() => {
    // Listen for viewport resize so switching desktop→mobile auto-locks to dark
    const handleResize = () => {
      const next = preferredTheme();
      setChosen(next);
      applyTheme(next);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleTheme = () => {
    // Only allow toggle on desktop
    if (isMobileViewport()) return;
    const next = theme === "dark" ? "light" : "dark";
    setChosen(next);
    localStorage.setItem("portfolio-theme", next);
    applyTheme(next);
  };

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
