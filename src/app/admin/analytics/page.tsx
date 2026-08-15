"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  Eye,
  Heart,
  Share2,
  Bookmark,
  FileCheck,
  Users,
  Calendar,
  ArrowUpRight,
  Filter,
  Monitor,
  Globe,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { formatDateTime } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const toast = useToast();
  const [days, setDays] = useState(30);
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState("ALL");

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/analytics?days=${days}`);
      const data = await res.json();
      setMetrics(data);
    } catch {
      toast.error("Analitika ma'lumotlarini yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const handleExport = (format: "csv" | "json") => {
    window.open(`/api/analytics?days=${days}&export=${format}`, "_blank");
    toast.success(`Analitika hisoboti ${format.toUpperCase()} formatida yuklab olinmoqda...`);
  };

  const filteredLogs =
    metrics?.activityLogs?.filter((l: any) =>
      eventFilter === "ALL" ? true : l.eventType.includes(eventFilter)
    ) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F5F7F2]">
            Detailed Activity & Event Analytics
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Kim, qachon, qaysi qurilmadan like bosgani, ulashgani (share) va ko'rgani haqidagi real statistika
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                  days === d ? "bg-[#A3E635] text-[#050607] font-bold" : "text-[#9CA3AF]"
                }`}
              >
                {d}D
              </button>
            ))}
          </div>

          <Button size="sm" variant="glass" onClick={() => handleExport("csv")}>
            <Download className="w-3.5 h-3.5" />
            <span>CSV Yuklash</span>
          </Button>

          <Button size="sm" variant="glass" onClick={() => handleExport("json")}>
            <Download className="w-3.5 h-3.5" />
            <span>JSON Yuklash</span>
          </Button>
        </div>
      </div>

      {/* Metrics Summary */}
      {metrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF] font-semibold">Sahifa Ko'rishlar</span>
              <Eye className="w-4 h-4 text-[#A3E635]" />
            </div>
            <p className="text-3xl font-extrabold font-display text-[#A3E635]">
              {metrics.pageViews?.toLocaleString() || 0}
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF] font-semibold">Yoqtirishlar (Likes)</span>
              <Heart className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-3xl font-extrabold font-display text-rose-400">
              {metrics.likes?.toLocaleString() || 0}
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF] font-semibold">Uzatishlar (Shares)</span>
              <Share2 className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-3xl font-extrabold font-display text-sky-400">
              {metrics.activityLogs?.filter((l: any) => l.eventType === "SHARE").length || 0}
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#9CA3AF] font-semibold">Konversiya Foizi</span>
              <FileCheck className="w-4 h-4 text-amber-300" />
            </div>
            <p className="text-3xl font-extrabold font-display text-amber-300">
              {metrics.conversionRate}%
            </p>
          </div>
        </div>
      )}

      {/* Granular Activity Log Table */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden bg-[#080A0B]/80 space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div>
            <h3 className="text-base font-bold font-display text-[#F5F7F2]">
              Haqiqiy Foydalanuvchilar Faoliyati Jurnali
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Har bir like, share va ko'rish hodisasi aniq qayd etilgan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#6B7280]" />
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="h-8 px-3 rounded-lg bg-[#050607] border border-white/10 text-xs text-[#F5F7F2]"
            >
              <option value="ALL">Barcha amallar</option>
              <option value="LIKE">Faqat Like bosganlar</option>
              <option value="SHARE">Faqat Uzatganlar (Shares)</option>
              <option value="VIEW">Faqat Ko'rganlar (Views)</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-[#6B7280]">Yuklanmoqda...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#9CA3AF]">
            Ushbu davrda qayd etilgan amallar mavjud emas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/[0.02] text-[#6B7280] font-mono">
                <tr>
                  <th className="py-3 px-4">Amal turi</th>
                  <th className="py-3 px-4">Loyiha / Sahifa</th>
                  <th className="py-3 px-4">Foydalanuvchi / IP</th>
                  <th className="py-3 px-4">Qurilma & Brauzer</th>
                  <th className="py-3 px-4">Manba (Referrer)</th>
                  <th className="py-3 px-4 text-right">Vaqt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.map((log: any) => {
                  let badge = "bg-white/5 text-[#9CA3AF]";
                  let icon = <Eye className="w-3 h-3 text-[#6B7280]" />;

                  if (log.eventType.includes("LIKE")) {
                    badge = "bg-rose-500/15 text-rose-400 border border-rose-500/30";
                    icon = <Heart className="w-3 h-3 text-rose-400" fill="currentColor" />;
                  } else if (log.eventType.includes("SHARE")) {
                    badge = "bg-sky-500/15 text-sky-400 border border-sky-500/30";
                    icon = <Share2 className="w-3 h-3 text-sky-400" />;
                  } else if (log.eventType.includes("VIEW")) {
                    badge = "bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30";
                    icon = <Eye className="w-3 h-3 text-[#A3E635]" />;
                  }

                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${badge}`}>
                          {icon}
                          <span>{log.eventType.replace("PROJECT_", "")}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#F5F7F2]">
                        {log.targetName}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[#9CA3AF]">
                        {log.ipHash}
                      </td>

                      <td className="py-3.5 px-4 text-[#6B7280] font-mono text-[11px] truncate max-w-xs">
                        {log.userAgent}
                      </td>

                      <td className="py-3.5 px-4 text-[#6B7280] text-[11px]">
                        {log.referrer}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-[#6B7280] text-[11px] whitespace-nowrap">
                        {formatDateTime(log.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
