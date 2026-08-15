"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, FileCheck, ArrowUpRight, CheckCircle2, Clock, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { formatDateTime } from "@/lib/utils";

export default function AdminBriefsPage() {
  const toast = useToast();
  const [briefs, setBriefs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchBriefs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/briefs?status=${statusFilter}`);
      const data = await res.json();
      setBriefs(data.briefs || []);
    } catch {
      toast.error("Brieflarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefs();
  }, [statusFilter]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F5F7F2]">
            AI Brief Analyzer & Requests
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Foydalanuvchilar tomonidan yuborilgan loyiha so'rovlari va Sun'iy intellekt tahlillari
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-xl bg-[#080A0B] border border-white/10 text-xs text-[#F5F7F2]"
        >
          <option value="ALL">Barcha holatlar</option>
          <option value="NEW">Yangi (New)</option>
          <option value="REVIEWING">Ko'rib chiqilmoqda</option>
          <option value="CONTACTED">Bog'lanildi</option>
          <option value="APPROVED">Tasdiqlangan</option>
        </select>
      </div>

      {/* Briefs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {briefs.map((brief) => {
          let types = [];
          try {
            types = Array.isArray(brief.projectTypes) ? brief.projectTypes : JSON.parse(brief.projectTypes);
          } catch {
            types = [brief.projectTypes || "3D Design"];
          }

          return (
            <div
              key={brief.id}
              className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#A3E635]/15 text-[#A3E635] font-bold">
                    {brief.status}
                  </span>
                  <span className="text-[11px] font-mono text-[#6B7280]">
                    {formatDateTime(brief.createdAt)}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-display text-[#F5F7F2]">
                    {brief.clientName}
                  </h3>
                  <p className="text-xs text-[#9CA3AF]">
                    {brief.company && `${brief.company} • `}
                    {brief.email}
                    {brief.telegram && ` • ${brief.telegram}`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {types.map((t: string, ti: number) => (
                    <span
                      key={ti}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[10px] font-mono text-[#F5F7F2]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-[#9CA3AF] line-clamp-2 leading-relaxed">
                  {brief.description}
                </p>

                {/* AI Brief Highlights */}
                {brief.analysis && (
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-[#A3E635] font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Tahlil Natijasi:</span>
                    </div>
                    <p className="text-[11px] text-[#9CA3AF] line-clamp-2">
                      {brief.analysis.summary}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280] pt-1">
                      <span>Murakkablik: <strong className="text-[#F5F7F2]">{brief.analysis.estimatedComplexity}</strong></span>
                      <span>Shoshilinchlik: <strong className="text-[#F5F7F2]">{brief.analysis.urgency}</strong></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs font-mono text-[#A3E635] font-bold">
                  Byudjet: {brief.budgetRange}
                </span>

                <Link href={`/admin/briefs/${brief.id}`}>
                  <Button size="sm" variant="primary" className="text-xs">
                    <span>AI Tahlilni Ko'rish</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
