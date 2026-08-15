"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Send, Instagram, ArrowUpRight, Heart, Mail } from "lucide-react";
import { useLanguage } from "@/components/ui/LanguageSelector";

interface FooterProps {
  socials?: any[];
  settings?: any;
}

export function Footer({ socials = [], settings }: FooterProps) {
  const { t } = useLanguage();
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-[#050607] pt-20 pb-12 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/15 shadow-md bg-[#050607]">
                <img src="/avatar.jpg" alt="Otajon Jahongirov" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-display font-semibold tracking-tight text-[#F5F7F2]">
                  {settings?.authorName || "OTAJON JAHONGIROV"}
                </span>
                <span className="text-[10px] text-[#9CA3AF] tracking-wider uppercase font-medium">
                  VISUAL & 3D STUDIO
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm font-normal text-[#9CA3AF] leading-relaxed max-w-sm">
              Zamonaviy 3D vizual texnologiyalar va mukammal dizayn standarti orqali sifatli natija taqdim etaman.
            </p>

            {/* Direct Social Icon Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://t.me/ustozmee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass-panel border border-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#A3E635] hover:border-[#A3E635]/40 transition shadow-sm"
                title="Telegram Kanal (@ustozmee)"
                aria-label="Telegram Kanal"
              >
                <Send className="w-4 h-4" />
              </a>

              <a
                href="https://t.me/otajon9999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass-panel border border-white/10 flex items-center justify-center text-[#BEF264] hover:text-[#A3E635] hover:border-[#A3E635]/40 transition shadow-sm"
                title="Telegram Lichka (@otajon9999)"
                aria-label="Telegram Lichka"
              >
                <Send className="w-4 h-4" />
              </a>

              <a
                href="https://instagram.com/ustozmee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl glass-panel border border-white/10 flex items-center justify-center text-[#9CA3AF] hover:text-[#A3E635] hover:border-[#A3E635]/40 transition shadow-sm"
                title="Instagram (@ustozmee)"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-4">
            <p className="text-xs font-display font-semibold tracking-wider text-[#F5F7F2] uppercase">
              Ishlar
            </p>
            <ul className="space-y-2.5 text-xs text-[#9CA3AF] font-normal">
              <li>
                <Link href="/works?category=3D+CGI" className="hover:text-[#A3E635] transition">
                  3D CGI & Motion
                </Link>
              </li>
              <li>
                <Link href="/works?category=Interior+Design" className="hover:text-[#A3E635] transition">
                  Interior Design
                </Link>
              </li>
              <li>
                <Link href="/works?category=Photo+Manipulation" className="hover:text-[#A3E635] transition">
                  Photo Manipulation
                </Link>
              </li>
              <li>
                <Link href="/works?category=Brand+Identity" className="hover:text-[#A3E635] transition">
                  Brand Identity
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Links */}
          <div className="md:col-span-2 space-y-4">
            <p className="text-xs font-display font-semibold tracking-wider text-[#F5F7F2] uppercase">
              Studio
            </p>
            <ul className="space-y-2.5 text-xs text-[#9CA3AF] font-normal">
              <li>
                <Link href="/services" className="hover:text-[#A3E635] transition">
                  Xizmatlar
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#A3E635] transition">
                  Men haqimda
                </Link>
              </li>
              <li>
                <Link href="/request" className="hover:text-[#A3E635] transition">
                  Loyiha so'rovi
                </Link>
              </li>
              <li>
                <Link href="/client" className="hover:text-[#A3E635] transition">
                  Mijoz Portali
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact coordinates */}
          <div className="md:col-span-3 space-y-4">
            <p className="text-xs font-display font-semibold tracking-wider text-[#F5F7F2] uppercase">
              To'g'ridan-to'g'ri aloqa
            </p>
              <a
                href="mailto:pixselsaga@gmail.com"
                className="flex items-center gap-2 hover:text-[#A3E635] transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>pixselsaga@gmail.com</span>
              </a>
              <a
                href="https://t.me/otajon9999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#A3E635] transition"
              >
                <Send className="w-3.5 h-3.5 text-[#BEF264]" />
                <span>@otajon9999</span>
              </a>
              <a
                href="https://instagram.com/ustozmee"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-[#A3E635] transition"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>@ustozmee</span>
              </a>
              <p className="text-[11px] text-[#6B7280] pt-2">
                Navoiy, O'zbekiston • Global masofaviy hamkorlik
              </p>
          </div>
        </div>

        {/* Copyright & Meta */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6B7280] font-normal gap-4">
          <p>© {currentYear} Otajon Jahongirov. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4">
            <Link href="/client" className="hover:text-[#9CA3AF] transition">
              Mijoz xonasi
            </Link>
            <Link href="/admin/login" className="hover:text-[#9CA3AF] transition">
              Admin CMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
