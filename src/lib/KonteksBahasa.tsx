"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, TranslationKey } from "./i18n";
import { translations } from "./terjemahan";
import { useIsClient } from "./useIsClient";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKey;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // The server (and hydration) always renders English; a saved "id" preference is
  // applied right after hydration, while the preloader still hides the page.
  const isClient = useIsClient();
  const [chosen, setChosen] = useState<Language | null>(null);
  const language =
    chosen ?? (isClient && localStorage.getItem("portfolio-lang") === "id" ? "id" : "en");

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setChosen(lang);
    localStorage.setItem("portfolio-lang", lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
