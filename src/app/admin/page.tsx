import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  Eye,
  Heart,
  Bookmark,
  Users,
  FileCheck,
  TrendingUp,
  FolderKanban,
  Files,
  Plus,
  ArrowUpRight,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getAnalyticsMetrics } from "@/lib/analytics";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const metrics = await getAnalyticsMetrics(30);

  const [recentBriefs, recentMessages, projectsCount, servicesCount] = await Promise.all([
    prisma.brief.findMany({
      where: { deletedAt: null },
      include: { analysis: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.contactMessage.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.project.count({ where: { deletedAt: null } }),
    prisma.service.count({ where: { deletedAt: null } }),
  ]);

  const kpis = [
    {
      title: "Jami Sahifa Ko'rishlar",
      value: metrics.pageViews.toLocaleString(),
      icon: Eye,
      change: "+18%",
      color: "text-[#A3E635]",
    },
    {
      title: "Loyiha Ko'rishlar",
      value: metrics.projectViews.toLocaleString(),
      icon: FolderKanban,
      change: "+24%",
      color: "text-sky-400",
    },
    {
      title: "Yoqtirishlar (Likes)",
      value: metrics.likes.toLocaleString(),
      icon: Heart,
      change: "+12%",
      color: "text-rose-400",
    },
    {
      title: "Brief & So'rovlar",
      value: (metrics.briefSubmissions + metrics.contactSubmissions).toString(),
      icon: FileCheck,
      change: `${metrics.conversionRate}% conv`,
      color: "text-amber-300",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F5F7F2]">
            Studio Dashboard
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Xush kelibsiz! Barcha studiya statistikasi va so'rovlar nazorat ostida.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/projects/new">
            <Button size="sm" variant="primary">
              <Plus className="w-4 h-4" />
              <span>Yangi loyiha</span>
            </Button>
          </Link>

          <Link href="/admin/files">
            <Button size="sm" variant="glass">
              <Files className="w-4 h-4" />
              <span>Fayl yuklash</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-2xl glass-panel border border-white/10 bg-[#080A0B]/90 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#9CA3AF]">{kpi.title}</span>
                <div className={`p-2 rounded-xl bg-white/5 ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold font-display text-[#F5F7F2]">
                  {kpi.value}
                </span>
                <span className="text-xs font-mono font-bold text-[#A3E635]">
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Chart & Top Projects Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Daily Views Bar Preview */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-[#F5F7F2]">
                So'nggi 14 kunlik tashriflar va konversiyalar
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-0.5">Haqiqiy hodisalar asosidagi faollik</p>
            </div>
            <Link href="/admin/analytics" className="text-xs font-mono text-[#A3E635] hover:underline flex items-center gap-1">
              <span>Batafsil tahlil</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-56 flex items-end justify-between gap-2 pt-6 border-b border-white/10 pb-4">
            {metrics.dailyData.map((d, idx) => {
              const maxView = Math.max(...metrics.dailyData.map((x) => x.views), 10);
              const heightPercent = Math.max((d.views / maxView) * 100, 8);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all px-2 py-1 rounded bg-[#0D1112] border border-white/10 text-[10px] font-mono text-[#F5F7F2] whitespace-nowrap z-20 shadow-xl pointer-events-none">
                    {d.views} ko'rish, {d.conversions} so'rov
                  </div>
                  <div
                    className="w-full bg-[#A3E635]/30 group-hover:bg-[#A3E635] rounded-t-md transition-all duration-300"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[9px] font-mono text-[#6B7280]">{d.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Projects */}
        <div className="lg:col-span-4 p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <h3 className="text-sm font-bold font-display text-[#F5F7F2]">
              Eng ko'p ko'rilgan loyihalar
            </h3>
            <Link href="/admin/projects" className="text-xs font-mono text-[#A3E635]">
              Barchasi →
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.topProjects.map((tp) => (
              <Link
                key={tp.id}
                href={`/admin/projects/${tp.id}`}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition"
              >
                <img
                  src={tp.coverImage}
                  alt={tp.titleUz}
                  className="w-10 h-10 rounded-lg object-cover border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#F5F7F2] truncate">{tp.titleUz}</p>
                  <p className="text-[10px] text-[#6B7280]">{tp.category}</p>
                </div>
                <span className="text-xs font-mono text-[#A3E635] flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {tp.views}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Briefs & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Briefs */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A3E635]" />
              <h3 className="text-sm font-bold font-display text-[#F5F7F2]">
                So'nggi Loyiha Brieflari
              </h3>
            </div>
            <Link href="/admin/briefs" className="text-xs font-mono text-[#A3E635]">
              Barchasi →
            </Link>
          </div>

          <div className="space-y-3">
            {recentBriefs.map((b) => (
              <Link
                key={b.id}
                href={`/admin/briefs/${b.id}`}
                className="block p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-[#A3E635]/40 transition space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F5F7F2]">{b.clientName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#A3E635]/15 text-[#A3E635]">
                    {b.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#9CA3AF] line-clamp-1">{b.description}</p>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280] pt-1">
                  <span>Byudjet: {b.budgetRange}</span>
                  {b.analysis && <span>Murakkablik: {b.analysis.estimatedComplexity}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#A3E635]" />
              <h3 className="text-sm font-bold font-display text-[#F5F7F2]">
                Yangi Inbox Xabarlari
              </h3>
            </div>
            <Link href="/admin/messages" className="text-xs font-mono text-[#A3E635]">
              Barchasi →
            </Link>
          </div>

          <div className="space-y-3">
            {recentMessages.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#F5F7F2]">{m.name}</span>
                  <span className="text-[10px] font-mono text-[#6B7280]">{m.email}</span>
                </div>
                <p className="text-[#9CA3AF] line-clamp-1">{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
