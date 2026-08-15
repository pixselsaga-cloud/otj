"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, ArrowRight, ShieldCheck, HelpCircle, Layers, CheckCircle2, MessageSquare, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export default function ClientEntryPage() {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    const code = accessCode.trim().toUpperCase();

    if (!code) {
      toast.error("Iltimos, maxsus kirish kodini kiriting.");
      return;
    }

    setIsLoading(true);
    router.push(`/client/${code}`);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#A3E635]/10 rounded-full blur-[60px] sm:blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-xl space-y-6 sm:space-y-8">
        {/* Main Card */}
        <div className="p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/95 shadow-2xl space-y-6 relative">
          <div className="text-center space-y-2.5 sm:space-y-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/30 text-[#A3E635] flex items-center justify-center mx-auto shadow-inner">
              <KeyRound className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h1 className="text-2xl sm:text-4xl font-display font-semibold text-[#F5F7F2]">
              Mijoz Xonasi Portali
            </h1>
            <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
              Sizga biriktirilgan maxsus kirish kodi (Access Code) orqali shaxsiy loyiha xonangizga kiring.
            </p>
          </div>

          <form onSubmit={handleAccess} className="space-y-4 pt-1">
            <Input
              label="Maxsus Xona Kodi (Access Code)"
              placeholder="Masalan: CL-8921"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              required
              autoFocus
              className="text-center font-mono font-bold tracking-widest text-sm uppercase"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center text-xs font-semibold uppercase tracking-wider"
              isLoading={isLoading}
            >
              <span>Xonaga kirish</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        </div>

        {/* Informative Explanation Box */}
        <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/90 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A3E635]/10 border border-[#A3E635]/20 text-[10px] sm:text-xs font-mono text-[#A3E635] uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Mijoz xonasi nima?</span>
            </div>
            <h3 className="text-base sm:text-lg font-display font-semibold text-[#F5F7F2]">
              Shaxsiy loyiha boshqaruv kabinetingiz
            </h3>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Mijoz xonasi — bu sizning loyihangiz bo'yicha barcha jarayonlar, bosqichlar, fayllar va hisobotlar bir joyda to'plangan maxfiy va qulay raqamli xonadir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-[#A3E635]">
                <Layers className="w-4 h-4" />
                <h4 className="text-xs font-semibold text-[#F5F7F2]">Bosqichlar</h4>
              </div>
              <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                Loyihaning qaysi foizi bitganini real vaqtda kuzatib borasiz.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-[#BEF264]">
                <CheckCircle2 className="w-4 h-4" />
                <h4 className="text-xs font-semibold text-[#F5F7F2]">Tayyor fayllar</h4>
              </div>
              <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                Renderlar, videoroliklar va manba fayllarni to'g'ridan-to'g'ri yuklab olasiz.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-[#A3E635]">
                <MessageSquare className="w-4 h-4" />
                <h4 className="text-xs font-semibold text-[#F5F7F2]">To'g'ridan-to'g'ri chat</h4>
              </div>
              <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                O'zgartirish va takliflarni xona ichidan to'g'ridan-to'g'ri yozasiz.
              </p>
            </div>
          </div>

          {/* How to get access code */}
          <div className="pt-4 border-t border-white/5 space-y-3">
            <h4 className="text-xs font-semibold text-[#F5F7F2]">
              Maxsus kodni kimdan va qanday olasiz?
            </h4>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Loyiha tasdiqlangach, kirish kodi (masalan: <code className="text-[#A3E635] bg-white/5 px-1.5 py-0.5 rounded font-mono">CL-8921</code>) sizga <strong>Otajon Jahongirov</strong> tomonidan Telegram yoki elektron pochta orqali shaxsan taqdim etiladi.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="https://t.me/otajon9999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#A3E635]/15 border border-[#A3E635]/30 text-xs font-semibold text-[#A3E635] hover:bg-[#A3E635] hover:text-[#050607] transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kodni Telegramdan so'rash</span>
              </a>

              <Link
                href="/request"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-[#F5F7F2] hover:bg-white/10 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Yangi loyiha topshirish</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
