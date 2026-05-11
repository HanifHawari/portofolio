"use client";

import { motion } from "framer-motion";
import { MapPin, Wifi } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="border-t border-zinc-800 bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <span className="tracking-wider">{t.footer.copyright}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} />
              {t.footer.location}
            </span>
            <span className="text-zinc-700">|</span>
            <span className="flex items-center gap-1.5">
              <Wifi size={12} className="text-green-500" />
              {t.footer.remote}
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
