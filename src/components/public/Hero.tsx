"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Send, Instagram } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/components/ui/LanguageSelector";

interface HeroProps {
  settings?: {
    headlineUz?: string;
    headlineRu?: string;
    headlineEn?: string;
    bioUz?: string;
    bioRu?: string;
    bioEn?: string;
    availabilityUz?: string;
  };
}

export function Hero({ settings }: HeroProps) {
  const { t, lang } = useLanguage();

  const headline =
    (lang === "uz" ? settings?.headlineUz : lang === "ru" ? settings?.headlineRu : settings?.headlineEn) ||
    t.hero.headline;

  const bio =
    (lang === "uz" ? settings?.bioUz : lang === "ru" ? settings?.bioRu : settings?.bioEn) ||
    t.hero.subtext;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
      {/* Background Gradients & Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] lg:w-[800px] h-[320px] sm:h-[600px] lg:h-[800px] bg-gradient-to-br from-[#A3E635]/15 via-[#BEF264]/5 to-transparent rounded-full blur-[100px] sm:blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-[200px] sm:w-[350px] h-[200px] sm:h-[350px] bg-[#BEF264]/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8 relative z-10 w-full">
        {/* Availability Badge (Inter 500-600) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full glass-panel border border-white/10 text-xs font-sans font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
          <span className="text-[#F5F7F2] font-medium text-[11px] sm:text-xs">
            {settings?.availabilityUz || t.hero.status || "Yangi loyihalar uchun ochiq"}
          </span>
        </motion.div>

        {/* Hero H1 (Space Grotesk 600-700) */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[76px] 2xl:text-[84px] font-display font-semibold sm:font-bold tracking-tight text-[#F5F7F2] leading-[1.15] sm:leading-[1.1] max-w-4xl mx-auto"
        >
          {headline}
        </motion.h1>

        {/* Hero Subtitle / Body (Inter 400) */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base font-sans font-normal text-[#9CA3AF] leading-relaxed px-2"
        >
          {bio}
        </motion.p>

        {/* Action Buttons (Inter 500-600) & Direct Socials */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4"
        >
          <Link href="/request" className="w-full xs:w-auto">
            <Button size="lg" variant="primary" className="w-full xs:w-auto font-sans font-semibold text-xs sm:text-sm shadow-[0_0_25px_rgba(163,230,53,0.3)]">
              <span>{t.hero.startProject}</span>
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>

          <Link href="/works" className="w-full xs:w-auto">
            <Button size="lg" variant="glass" className="w-full xs:w-auto font-sans font-medium text-xs sm:text-sm">
              <span>{t.hero.exploreWorks || "Ishlarni ko'rish"}</span>
            </Button>
          </Link>

          {/* Direct Social Icon Action Buttons */}
          <div className="flex items-center gap-2 pt-2 xs:pt-0">
            <a
              href="https://t.me/ustozmee"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl glass-panel border border-white/10 flex items-center justify-center text-[#F5F7F2] hover:bg-[#A3E635] hover:text-[#050607] hover:border-[#A3E635] transition duration-300 shadow-md"
              title="Telegram Kanal (@ustozmee)"
              aria-label="Telegram Kanal"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

            <a
              href="https://t.me/otajon9999"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl glass-panel border border-white/10 flex items-center justify-center text-[#BEF264] hover:bg-[#A3E635] hover:text-[#050607] hover:border-[#A3E635] transition duration-300 shadow-md"
              title="Telegram Lichka (@otajon9999)"
              aria-label="Telegram Lichka"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

            <a
              href="https://instagram.com/ustozmee"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl glass-panel border border-white/10 flex items-center justify-center text-[#F5F7F2] hover:bg-[#A3E635] hover:text-[#050607] hover:border-[#A3E635] transition duration-300 shadow-md"
              title="Instagram (@ustozmee)"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
