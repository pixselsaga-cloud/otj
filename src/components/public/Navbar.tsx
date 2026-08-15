"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/ui/LanguageSelector";
import { LanguageSelector } from "@/components/ui/LanguageSelector";
import { Button } from "@/components/ui/Button";
import { Send, Instagram, ArrowUpRight, Menu, X } from "lucide-react";

export function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/works", label: t.nav.works },
    { href: "/services", label: t.nav.services },
    { href: "/about", label: t.nav.about },
    { href: "/request", label: t.nav.request },
    { href: "/client", label: t.nav.clientPortal || "Mijoz xonasi" },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "py-3.5 bg-[#050607]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Name (Space Grotesk 600) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/15 group-hover:border-[#A3E635] transition duration-300 shadow-md bg-[#050607]">
              <img src="/avatar.jpg" alt="Otajon Jahongirov" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-display font-semibold tracking-tight text-[#F5F7F2] group-hover:text-[#A3E635] transition">
                OTAJON JAHONGIROV
              </span>
              <span className="text-[10px] font-sans font-medium text-[#9CA3AF] tracking-wider uppercase">
                STUDIO • VISUAL & 3D
              </span>
            </div>
          </Link>

          {/* Desktop Nav (Inter 500) */}
          <nav className="hidden md:flex items-center gap-1 glass-panel px-4 py-1.5 rounded-full border border-white/10 font-sans">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition duration-200 ${
                    isActive
                      ? "text-[#050607] font-semibold"
                      : "text-[#9CA3AF] hover:text-[#F5F7F2]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 bg-[#A3E635] rounded-full -z-10 shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action & Direct Social Icons (Inter 500-600) */}
          <div className="hidden md:flex items-center gap-3 font-sans">
            <div className="flex items-center gap-1.5 pr-2 border-r border-white/10">
              <a
                href="https://t.me/ustozmee"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl glass-panel text-[#9CA3AF] hover:text-[#A3E635] hover:border-[#A3E635]/40 transition border border-white/10"
                title="Telegram Kanal (@ustozmee)"
                aria-label="Telegram Kanal"
              >
                <Send className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://t.me/otajon9999"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl glass-panel text-[#9CA3AF] hover:text-[#A3E635] hover:border-[#A3E635]/40 transition border border-white/10"
                title="Telegram Lichka (@otajon9999)"
                aria-label="Telegram Lichka"
              >
                <Send className="w-3.5 h-3.5 text-[#BEF264]" />
              </a>

              <a
                href="https://instagram.com/ustozmee"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl glass-panel text-[#9CA3AF] hover:text-[#A3E635] hover:border-[#A3E635]/40 transition border border-white/10"
                title="Instagram (@ustozmee)"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            </div>

            <LanguageSelector />

            <Link href="/request">
              <Button size="sm" variant="primary" className="text-xs font-sans font-semibold">
                <span>{t.hero.startProject}</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl glass-panel text-[#F5F7F2] border border-white/10"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 pt-24 px-6 bg-[#050607]/98 backdrop-blur-2xl md:hidden flex flex-col justify-between pb-8 font-sans"
          >
            <div className="space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 px-4 rounded-xl text-base font-medium transition ${
                      isActive
                        ? "bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 font-semibold"
                        : "text-[#9CA3AF] hover:text-[#F5F7F2] hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-around">
                <a
                  href="https://t.me/ustozmee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-[#A3E635]"
                >
                  <Send className="w-4 h-4" />
                  <span>TG Kanal</span>
                </a>

                <a
                  href="https://t.me/otajon9999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-[#A3E635]"
                >
                  <Send className="w-4 h-4" />
                  <span>TG Lichka</span>
                </a>

                <a
                  href="https://instagram.com/ustozmee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-semibold text-[#A3E635]"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              </div>

              <Link href="/request" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full justify-center text-sm font-semibold">
                  {t.hero.startProject}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
