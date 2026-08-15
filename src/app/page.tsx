import prisma from "@/lib/prisma";
import { Hero } from "@/components/public/Hero";
import { StatsSection } from "@/components/public/StatsSection";
import { WorksGrid } from "@/components/public/WorksGrid";
import { ServicesSection } from "@/components/public/ServicesSection";
import { ProcessSection } from "@/components/public/ProcessSection";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowUpRight } from "lucide-react";

export const revalidate = 0;

export default async function HomePage() {
  const [settings, stats, projects, services, processSteps] = await Promise.all([
    prisma.siteSettings.findUnique({
      where: { id: "default" },
    }),
    prisma.statistic.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.project.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      take: 6,
    }),
    prisma.service.findMany({
      where: { deletedAt: null, status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.processStep.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return (
    <div className="w-full font-sans">
      {/* Hero */}
      <Hero settings={settings || undefined} />

      {/* Live Statistics */}
      <StatsSection stats={stats} />

      {/* Featured Works Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-[#A3E635] tracking-widest uppercase mb-3">
              PORTFOLIO
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-semibold tracking-tight text-[#F5F7F2]">
              Tanlangan ishlar
            </h2>
          </div>
          <Link href="/works">
            <Button variant="outline" size="sm" className="group font-sans font-medium text-xs">
              <span>Barcha ishlarni ko'rish</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        <WorksGrid projects={projects} showFilter={false} limit={4} />
      </section>

      {/* Services Catalogue Preview */}
      <ServicesSection services={services} />

      {/* 5-Step Process */}
      <ProcessSection steps={processSteps} />

      {/* Bottom Creative CTA Banner */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-10 sm:p-16 glass-panel border border-[#A3E635]/30 bg-gradient-to-br from-[#0D1112] via-[#080A0B] to-[#050607] text-center overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#A3E635]/15 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6 font-sans">
              <span className="px-3.5 py-1.5 rounded-full bg-[#A3E635]/15 border border-[#A3E635]/30 text-xs font-mono font-medium text-[#A3E635] uppercase tracking-widest">
                YANGI LOYIHA BOSHLASH
              </span>

              <h2 className="text-3xl sm:text-5xl font-display font-semibold text-[#F5F7F2] leading-tight">
                Keyingi loyihangizni birgalikda boshlaymizmi?
              </h2>

              <p className="text-sm sm:text-base font-normal text-[#CBD5E1] leading-relaxed max-w-xl mx-auto">
                G'oyangizni qoldiring, tezda tahlil qilib siz uchun qulay va sifatli yechim taklif qilamiz.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link href="/request">
                  <Button size="lg" variant="primary" className="group text-xs font-semibold uppercase tracking-wider">
                    <span>Loyiha Briefini to'ldirish</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="glass" className="text-xs font-medium">
                    <span>Bog'lanish</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
