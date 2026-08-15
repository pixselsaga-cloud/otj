"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/i18n";
import { Globe } from "lucide-react";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.uz;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("uz");

  useEffect(() => {
    const saved = localStorage.getItem("otj_lang") as Language;
    if (saved && (saved === "uz" || saved === "ru" || saved === "en")) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("otj_lang", newLang);
    document.documentElement.lang = newLang;
  };

  const t = translations[lang] || translations.uz;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
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

export function LanguageSelector({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const options: { code: Language; label: string; flag: string }[] = [
    { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
    { code: "en", label: "English", flag: "🇬🇧" },
  ];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-panel text-xs font-semibold text-[#F5F7F2] hover:border-[#A3E635]/40 transition border border-white/10"
        aria-label="Language Selector"
      >
        <Globe className="w-3.5 h-3.5 text-[#A3E635]" />
        <span className="uppercase">{lang}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-36 rounded-xl glass-panel bg-[#0D1112]/95 border border-white/10 shadow-2xl z-50 py-1 overflow-hidden backdrop-blur-xl">
            {options.map((opt) => (
              <button
                key={opt.code}
                onClick={() => {
                  setLang(opt.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition ${
                  lang === opt.code
                    ? "bg-[#A3E635]/15 text-[#A3E635] font-bold"
                    : "text-[#9CA3AF] hover:text-[#F5F7F2] hover:bg-white/5"
                }`}
              >
                <span>{opt.label}</span>
                <span>{opt.flag}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
