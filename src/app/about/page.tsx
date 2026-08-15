import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight, MapPin, Mail, Send, CheckCircle2, Sparkles, Cpu, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AboutPage() {
  let settings: any = null;
  let socials: any[] = [];

  try {
    const res = await Promise.all([
      prisma.siteSettings.findUnique({
        where: { id: "default" },
      }),
      prisma.socialLink.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);
    settings = res[0];
    socials = res[1] || [];
  } catch (err) {
    console.warn("About page database query skipped gracefully during build.");
  }

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
            <Link href="/works">
              <Button size="md" variant="glass" className="font-medium text-xs">
                <span>Portfolio ko'rish</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Image Column */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm aspect-[4/5] rounded-3xl overflow-hidden glass-panel border border-white/15 p-2 bg-[#080A0B] shadow-2xl group">
            <img
              src="/avatar.jpg"
              alt="Otajon Jahongirov"
              className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-[#080A0B] via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-xs font-mono font-bold text-[#A3E635] uppercase tracking-wider">AI MENEJER</p>
              <p className="text-base font-bold text-[#F5F7F2] font-display">Otajon Jahongirov</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/60 mb-20">
        <div>
          <span className="text-3xl sm:text-4xl font-extrabold font-display text-[#A3E635]">3+</span>
          <p className="text-xs font-mono text-[#9CA3AF] mt-1 uppercase">Yillik Tajriba</p>
        </div>
        <div>
          <span className="text-3xl sm:text-4xl font-extrabold font-display text-[#A3E635]">127+</span>
          <p className="text-xs font-mono text-[#9CA3AF] mt-1 uppercase">Mamnun Mijozlar</p>
        </div>
        <div>
          <span className="text-3xl sm:text-4xl font-extrabold font-display text-[#A3E635]">8</span>
          <p className="text-xs font-mono text-[#9CA3AF] mt-1 uppercase">Global Hamkor</p>
        </div>
        <div>
          <span className="text-3xl sm:text-4xl font-extrabold font-display text-[#A3E635]">100%</span>
          <p className="text-xs font-mono text-[#9CA3AF] mt-1 uppercase">Sifat Kafolati</p>
        </div>
      </div>

      {/* Philosophy / Approach */}
      <div className="space-y-8 mb-20">
        <h2 className="text-2xl sm:text-4xl font-bold font-display text-[#F5F7F2]">
          Mening Ish Prinsiplarim
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635]">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#F5F7F2]">AI Integratsiyasi</h3>
            <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
              Dizayn va vizual kontent yaratishda eng so'nggi sun'iy intellekt modellaridan unumli foydalanib, jarayonni 5x tezlashtiraman.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#F5F7F2]">Mukammal Vizual Sifat</h3>
            <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
              Har bir piksel, tekstura va yorug'lik effektini chuqur tahlil qilib, brendingizga xos bo'lgan premium ko'rinish yarataman.
            </p>
          </div>

          <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#F5F7F2]">Aniq Muddat & Shaffoflik</h3>
            <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
              Mijoz portali orqali loyihaning har bir bosqichini real vaqtda kuzatib borasiz, barcha fayllar o'z vaqtida topshiriladi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
