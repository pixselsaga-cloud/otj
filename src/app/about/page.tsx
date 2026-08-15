import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, MapPin, Mail, Send, CheckCircle2, Sparkles, Cpu, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function AboutPage() {
  const [settings, socials] = await Promise.all([
    prisma.siteSettings.findUnique({
      where: { id: "default" },
    }),
    prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Bio Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-[#A3E635] tracking-widest uppercase">
            AI MENEJER & VISUAL DIRECTOR
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-bold text-[#F5F7F2] tracking-tight leading-tight">
            {settings?.authorName || "Otajon Jahongirov"}
          </h1>

          <p className="text-xl sm:text-2xl text-[#A3E635] font-display font-semibold">
            AI Menejment va zamonaviy vizual texnologiyalar orqali yuqori natijalar
          </p>

          <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed font-normal">
            Men Otajon Jahongirov — AI Menejer va Visual Directorman. Zamonaviy sun'iy intellekt vositalari va 3D vizual texnologiyalarni birlashtirgan holda har bir loyihaga individual yondashaman. Navoiy shahrida faoliyat yuritaman va xalqaro hamda mahalliy loyihalarda sifat va natijani birinchi o'ringa qo'yaman.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-[#CBD5E1]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#A3E635]" />
              <span>Navoiy, O'zbekiston</span>
            </div>
            <a href="mailto:pixselsaga@gmail.com" className="flex items-center gap-2 hover:text-[#A3E635] transition">
              <Mail className="w-4 h-4 text-[#A3E635]" />
              <span>pixselsaga@gmail.com</span>
            </a>
            <a href="https://t.me/otajon9999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#A3E635] transition">
              <Send className="w-4 h-4 text-[#A3E635]" />
              <span>@otajon9999</span>
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link href="/request">
              <Button size="md" variant="primary" className="font-semibold text-xs uppercase tracking-wider">
                <span>Loyihani boshlash</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <a href="https://t.me/otajon9999" target="_blank" rel="noopener noreferrer">
              <Button size="md" variant="glass" className="font-medium text-xs">
                <span>To'g'ridan-to'g'ri bog'lanish</span>
              </Button>
            </a>
          </div>
        </div>

        {/* Profile Image (Clean Avatar) */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl p-3 glass-panel border border-white/10 bg-[#080A0B] overflow-hidden shadow-2xl">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#050607]">
              <img
                src="/avatar.jpg"
                alt="Otajon Jahongirov"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080A0B] via-transparent to-transparent opacity-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/60 mb-20 text-center">
        <div>
          <p className="text-4xl sm:text-5xl font-display font-bold text-[#A3E635] tracking-tight">
            3+
          </p>
          <p className="text-xs text-[#9CA3AF] mt-1 font-sans font-medium uppercase">Yillik Tajriba</p>
        </div>
        <div>
          <p className="text-4xl sm:text-5xl font-display font-bold text-[#F5F7F2] tracking-tight">
            127+
          </p>
          <p className="text-xs text-[#9CA3AF] mt-1 font-sans font-medium uppercase">Mamnun Mijozlar</p>
        </div>
        <div>
          <p className="text-4xl sm:text-5xl font-display font-bold text-[#F5F7F2] tracking-tight">
            8
          </p>
          <p className="text-xs text-[#9CA3AF] mt-1 font-sans font-medium uppercase">Global Hamkor</p>
        </div>
        <div>
          <p className="text-4xl sm:text-5xl font-display font-bold text-[#A3E635] tracking-tight">
            100%
          </p>
          <p className="text-xs text-[#9CA3AF] mt-1 font-sans font-medium uppercase">Sifat Kafolati</p>
        </div>
      </div>

      {/* Core Principles / Approach */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#A3E635]/15 text-[#A3E635] flex items-center justify-center mb-4">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-semibold text-[#F5F7F2]">
            AI & Smart Ishlov
          </h3>
          <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            Ilg'or sun'iy intellekt texnologiyalarini qo'llagan holda loyihalarni bir necha barobar tez va yuqori aniqlikda boshqarish.
          </p>
        </div>

        <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#A3E635]/15 text-[#A3E635] flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-semibold text-[#F5F7F2]">
            Vizual Standart
          </h3>
          <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            Har bir detal, kompozitsiya va rang uyg'unligida xalqaro darajadagi Dark Luxury va estetik mukammallik.
          </p>
        </div>

        <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#A3E635]/15 text-[#A3E635] flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-semibold text-[#F5F7F2]">
            Shaffoflik & Muddat
          </h3>
          <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
            Mijoz bilan doimiy aloqa, aniq muddatlarga qat'iy rioya qilish va tayyor sifatli natija topshirish.
          </p>
        </div>
      </div>
    </div>
  );
}
