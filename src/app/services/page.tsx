import prisma from "@/lib/prisma";
import { ServicesSection } from "@/components/public/ServicesSection";
import { ProcessSection } from "@/components/public/ProcessSection";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ServicesPage() {
  let services: any[] = [];
  let processSteps: any[] = [];

  try {
    const res = await Promise.all([
      prisma.service.findMany({
        where: { deletedAt: null, status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.processStep.findMany({
        where: { isVisible: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);
    services = res[0] || [];
    processSteps = res[1] || [];
  } catch (err) {
    console.warn("Services page database query skipped gracefully during build.");
  }

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header */}
      <div className="mb-16 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-[#A3E635] tracking-widest uppercase mb-3">
          XIZMATLAR & IMKONIYATLAR
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-semibold text-[#F5F7F2] tracking-tight mb-4">
          Xizmatlar va imkoniyatlar katalogi
        </h1>
        <p className="text-sm sm:text-base font-normal text-[#9CA3AF] leading-relaxed">
          AI Vizualizatsiya, fotorealistik 3D CGI renderlardan tortib brending tizimlari va interaktiv UI/UX mahsulotlarigacha — barchasi professional standartda.
        </p>
      </div>

      {/* Services Grid */}
      <ServicesSection services={services} />

      {/* Workflow */}
      <div className="my-16">
        <ProcessSection steps={processSteps} />
      </div>

      {/* Custom Project Estimator Box */}
      <div className="relative rounded-3xl p-8 sm:p-14 glass-panel border border-white/10 bg-[#080A0B] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3 font-sans">
            <span className="text-xs font-mono font-medium text-[#A3E635] uppercase tracking-wider">
              SHAXSIY TALABLAR
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-semibold text-[#F5F7F2]">
              Maxsus yoki nostandart loyihangiz bormi?
            </h2>
            <p className="text-xs sm:text-sm font-normal text-[#9CA3AF] leading-relaxed max-w-xl">
              Agar talablaringiz katalogdagi standart paketlarga to'g'ri kelmasa, biz siz uchun to'liq individual yechim va narx taklifini ishlab chiqamiz.
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link href="/request">
              <Button size="lg" variant="primary" className="text-xs font-semibold uppercase tracking-wider">
                <span>Individual Brief yuborish</span>
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
