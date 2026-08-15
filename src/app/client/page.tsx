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
    <div className="min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#A3E635]/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="w-full max-w-xl space-y-8">
        {/* Main Card */}
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/90 shadow-2xl space-y-6 relative">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/30 text-[#A3E635] flex items-center justify-center mx-auto shadow-inner">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-[#F5F7F2]">
              Mijoz Xonasi Portali
            </h1>
            <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
              Sizga biriktirilgan maxsus kirish kodi (Access Code) orqali shaxsiy loyiha xonangizga kiring.
            </p>
          </div>

          <form onSubmit={handleAccess} className="space-y-4 pt-2">
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
              className="w-full justify-center font-semibold text-xs uppercase tracking-wider"
              isLoading={isLoading}
            >
              <span>Xonaga kirish</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B7280] font-mono pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A3E635]" />
            <span>Fayllar va ma'lumotlar to'liq shifrlangan va xavfsiz</span>
          </div>
        </div>

        {/* Informational Cards: What is Client Room & How to get Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: What is Client Room? */}
          <div className="p-6 rounded-3xl glass-panel border border-white/5 bg-[#0D1112]/80 space-y-3">
            <div className="flex items-center gap-2 text-[#A3E635] font-display font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Mijoz xonasi nima?</span>
            </div>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Bu sizning buyurtmangiz uchun ochilgan shaxsiy interaktiv maydon bo'lib, unda:
            </p>
            <ul className="space-y-1.5 text-xs text-[#CBD5E1]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#A3E635] shrink-0" />
                <span>Loyihaning real vaqtdagi holati (Progress)</span>
              </li>
              <li className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#A3E635] shrink-0" />
                <span>Tayyor render va fayllarni yuklab olish</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#A3E635] shrink-0" />
                <span>To'g'ridan-to'g'ri tezkor izohlar (Live Chat)</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Who provides the code? */}
          <div className="p-6 rounded-3xl glass-panel border border-white/5 bg-[#0D1112]/80 space-y-3">
            <div className="flex items-center gap-2 text-[#A3E635] font-display font-semibold text-sm">
              <KeyRound className="w-4 h-4" />
              <span>Kodni qanday olasiz?</span>
            </div>
            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              Maxsus kirish kodi loyiha tasdiqlangandan so'ng to'g'ridan-to'g'ri <strong>Otajon Jahongirov</strong> tomonidan taqdim etiladi.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://t.me/otajon9999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#A3E635] hover:underline"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram orqali kod so'rash (@otajon9999)</span>
              </a>
              <Link
                href="/request"
                className="inline-flex items-center gap-2 text-xs font-medium text-[#9CA3AF] hover:text-[#F5F7F2]"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Yangi loyiha so'rovi (Brief) qoldirish</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
