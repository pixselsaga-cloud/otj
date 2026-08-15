"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, RefreshCw, CheckCircle2, UserCheck, ShieldCheck, AlertTriangle, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function BriefDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const id = params.id as string;

  const [brief, setBrief] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const fetchBrief = async () => {
    try {
      const res = await fetch(`/api/briefs/${id}`);
      if (!res.ok) throw new Error("Brief topilmadi");
      const data = await res.json();
      setBrief(data.brief);
    } catch {
      toast.error("Briefni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, [id]);

  const handleReanalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`/api/briefs/${id}/ai-analyze`, { method: "POST" });
      if (!res.ok) throw new Error("AI tahlilida xatolik");
      toast.success("AI tahlil muvaffaqiyatli yangilandi!");
      fetchBrief();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/briefs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Status o'zgartirilmadi");
      toast.success(`Status "${newStatus}" ga o'zgartirildi`);
      fetchBrief();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleConvertToClientRoom = async () => {
    if (!brief) return;
    setIsConverting(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: brief.clientName,
          company: brief.company,
          email: brief.email,
          phone: brief.phone,
          telegram: brief.telegram,
          createRoom: true,
          roomTitle: `${brief.clientName} — Maxsus Loyiha Xonasi`,
        }),
      });

      if (!res.ok) throw new Error("Mijoz yaratishda xatolik");
      const data = await res.json();
      await handleStatusChange("APPROVED");
      toast.success("Client Room muvaffaqiyatli yaratildi!", `Kod: ${data.room?.accessCode}`);
      router.push(`/admin/clients/${data.client.id}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsConverting(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-xs font-mono text-[#6B7280]">Yuklanmoqda...</div>;
  }

  if (!brief) {
    return <div className="p-12 text-center text-xs text-rose-400">Brief topilmadi.</div>;
  }

  const analysis = brief.analysis;
  let risks: string[] = [];
  let steps: string[] = [];
  let questions: string[] = [];
  let reqs: string[] = [];

  try {
    if (analysis) {
      risks = typeof analysis.potentialRisks === "string" ? JSON.parse(analysis.potentialRisks) : analysis.potentialRisks || [];
      steps = typeof analysis.recommendedNextSteps === "string" ? JSON.parse(analysis.recommendedNextSteps) : analysis.recommendedNextSteps || [];
      questions = typeof analysis.questionsToAsk === "string" ? JSON.parse(analysis.questionsToAsk) : analysis.questionsToAsk || [];
      reqs = typeof analysis.clientRequirements === "string" ? JSON.parse(analysis.clientRequirements) : analysis.clientRequirements || [];
    }
  } catch {}

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/briefs">
            <Button size="icon" variant="ghost">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold font-display text-[#F5F7F2]">
              {brief.clientName} — Brief Tahlili
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              Status: <span className="text-[#A3E635] font-bold">{brief.status}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm" variant="glass" onClick={handleReanalyze} isLoading={isAnalyzing}>
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Qayta AI tahlil qilish</span>
          </Button>

          <Button size="sm" variant="primary" onClick={handleConvertToClientRoom} isLoading={isConverting}>
            <UserCheck className="w-4 h-4" />
            <span>Client Room ochish</span>
          </Button>
        </div>
      </div>

      {/* Brief Specs & Description */}
      <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-white/5 text-xs">
          <div>
            <span className="text-[#6B7280] font-mono">MIJOZ</span>
            <p className="font-bold text-[#F5F7F2] mt-1">{brief.clientName}</p>
          </div>
          <div>
            <span className="text-[#6B7280] font-mono">KOMPANIYA</span>
            <p className="font-bold text-[#F5F7F2] mt-1">{brief.company || "—"}</p>
          </div>
          <div>
            <span className="text-[#6B7280] font-mono">BYUDJET</span>
            <p className="font-bold text-[#A3E635] mt-1">{brief.budgetRange}</p>
          </div>
          <div>
            <span className="text-[#6B7280] font-mono">MUDDAT</span>
            <p className="font-bold text-[#F5F7F2] mt-1">{brief.deadlineRange}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold font-display text-[#F5F7F2] mb-2">
            Mijoz tavsifi (Client Scope)
          </h3>
          <p className="text-sm text-[#9CA3AF] leading-relaxed bg-white/[0.02] p-4 rounded-2xl border border-white/5">
            {brief.description}
          </p>
        </div>
      </div>

      {/* AI Analysis Multi-factor Block */}
      {analysis && (
        <div className="p-8 rounded-3xl glass-panel border border-[#A3E635]/30 bg-[#0D1112] space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#A3E635]" />
              <h2 className="text-lg font-bold font-display text-[#F5F7F2]">
                Sun'iy Intellekt Tahlili va Xulosa
              </h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-white/5 text-[#F5F7F2]">
                Murakkablik: <strong className="text-[#A3E635]">{analysis.estimatedComplexity}</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 text-[#F5F7F2]">
                Shoshilinchlik: <strong className="text-[#A3E635]">{analysis.urgency}</strong>
              </span>
            </div>
          </div>

          <p className="text-sm text-[#F5F7F2] leading-relaxed italic bg-white/5 p-4 rounded-2xl border border-white/5">
            "{analysis.summary}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Requirements */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-[#A3E635] tracking-wider">
                Aniqlangan Talablar
              </h4>
              <ul className="space-y-2 text-xs text-[#9CA3AF]">
                {reqs.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[#A3E635]">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-[#A3E635] tracking-wider">
                Tavsiya etilayotgan keyingi qadamlar
              </h4>
              <ul className="space-y-2 text-xs text-[#9CA3AF]">
                {steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A3E635] shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Questions to ask */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h4 className="text-xs font-mono uppercase text-sky-400 tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Mijozga berilishi tavsiya qilingan aniqlashtiruvchi savollar:</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#9CA3AF]">
              {questions.map((q, i) => (
                <li key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[#F5F7F2]">
                  {i + 1}. {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
