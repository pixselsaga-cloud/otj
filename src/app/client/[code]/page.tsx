"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/ui/LanguageSelector";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Send,
  Sparkles,
  AlertCircle,
  FileText,
  Pin,
  Star,
  RefreshCw,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ClientRoomPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const code = (params.code as string)?.toUpperCase();

  const [room, setRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat State
  const [chatMessage, setChatMessage] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Revision Modal State
  const [isRevisionOpen, setIsRevisionOpen] = useState(false);
  const [revisionForm, setRevisionForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
  });
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);

  // Approval Modal State
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [approvalForm, setApprovalForm] = useState({
    name: "",
    feedback: "",
    rating: 5,
  });
  const [isApproving, setIsApproving] = useState(false);

  const fetchRoomData = async () => {
    try {
      const res = await fetch(`/api/client-room/${code}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError("Bunday kodga ega xona topilmadi.");
        } else {
          setError("Ma'lumotlarni yuklashda xatolik.");
        }
        return;
      }
      const data = await res.json();
      setRoom(data.room);
      if (data.room.client?.name) {
        setApprovalForm((prev) => ({ ...prev, name: data.room.client.name }));
      }
    } catch {
      setError("Server bilan bog'lanishda xatolik.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      fetchRoomData();
    }
  }, [code]);

  // Send Chat Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setIsSendingChat(true);
    try {
      const res = await fetch(`/api/client-room/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SEND_MESSAGE",
          senderType: "CLIENT",
          senderName: room.client?.name || "Mijoz",
          content: chatMessage,
        }),
      });

      if (!res.ok) throw new Error("Xabar yuborilmadi");
      setChatMessage("");
      fetchRoomData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSendingChat(false);
    }
  };

  // Submit Revision Request
  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionForm.title || !revisionForm.description) {
      toast.error("Iltimos, o'zgartirish mavzusi va tavsifini kiriting.");
      return;
    }

    setIsSubmittingRevision(true);
    try {
      const res = await fetch(`/api/client-room/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REQUEST_REVISION",
          ...revisionForm,
        }),
      });

      if (!res.ok) throw new Error("Talab yuborilmadi");
      toast.success("O'zgartirish talabi muvaffaqiyatli qabul qilindi!");
      setIsRevisionOpen(false);
      setRevisionForm({ title: "", description: "", priority: "MEDIUM" });
      fetchRoomData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmittingRevision(false);
    }
  };

  // Approve Project
  const handleApproveProject = async () => {
    setIsApproving(true);
    try {
      const res = await fetch(`/api/client-room/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "APPROVE_PROJECT",
          approvedBy: approvalForm.name || room.client?.name || "Client",
          feedback: approvalForm.feedback,
          rating: approvalForm.rating,
        }),
      });

      if (!res.ok) throw new Error("Tasdiqlashda xatolik");
      toast.success(t.clientRoom.approvalSuccess);
      setIsApprovalOpen(false);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#A3E635", "#BEF264", "#ffffff"],
        });
      } catch {}

      fetchRoomData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center pt-28">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#A3E635] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-[#9CA3AF]">Xona yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center pt-28 px-4">
        <div className="p-8 rounded-3xl glass-panel border border-white/10 text-center max-w-md space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h2 className="text-xl font-bold text-[#F5F7F2]">Xatolik yuz berdi</h2>
          <p className="text-sm text-[#9CA3AF]">{error || "Xona topilmadi"}</p>
          <Button variant="outline" size="sm" onClick={() => router.push("/client")}>
            Kodni qayta kiritish
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-white/10 bg-[#0D1112] mb-12 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#A3E635]/15 border border-[#A3E635]/30 text-xs font-mono text-[#A3E635] uppercase tracking-wider">
                ROOM CODE: {room.accessCode}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#F5F7F2]">
                STATUS: {room.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-[#F5F7F2]">
              {room.title}
            </h1>

            <p className="text-sm text-[#9CA3AF]">
              Mijoz: <span className="text-[#F5F7F2] font-semibold">{room.client?.name}</span>
              {room.client?.company && <span> ({room.client.company})</span>}
            </p>
          </div>

          {/* Action Area (Approval / Revisions) */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRevisionOpen(true)}
              disabled={room.isApproved}
            >
              <RefreshCw className="w-4 h-4" />
              <span>O'zgartirish so'rash</span>
            </Button>

            {room.isApproved ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>LOYIHA TASDIQLANGAN</span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsApprovalOpen(true)}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Loyihani tasdiqlash</span>
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#9CA3AF]">LOYYIHA BOSQICHLARI PROGRESSI</span>
            <span className="text-[#A3E635] font-bold">{room.progress}%</span>
          </div>
          <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#A3E635] h-full rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(163,230,53,0.5)]"
              style={{ width: `${room.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Milestones & Deliverables & Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Milestones & Deliverables) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Milestones */}
          <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
            <h3 className="text-lg font-bold font-display text-[#F5F7F2] flex items-center justify-between">
              <span>Loyihaning asosiy bosqichlari (Milestones)</span>
              <span className="text-xs font-mono text-[#6B7280]">
                {room.milestones?.filter((m: any) => m.status === "COMPLETED").length || 0}/
                {room.milestones?.length || 0}
              </span>
            </h3>

            <div className="space-y-4">
              {room.milestones?.map((ms: any, index: number) => {
                const isDone = ms.status === "COMPLETED";
                const isCurrent = ms.status === "IN_PROGRESS";

                return (
                  <div
                    key={ms.id}
                    className={`p-4 rounded-2xl border transition ${
                      isDone
                        ? "bg-[#A3E635]/5 border-[#A3E635]/30"
                        : isCurrent
                        ? "bg-white/5 border-white/20"
                        : "bg-transparent border-white/5 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isDone
                              ? "bg-[#A3E635] text-[#050607]"
                              : isCurrent
                              ? "bg-white/20 text-[#F5F7F2]"
                              : "bg-white/5 text-[#6B7280]"
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                        </div>
                        <span className="text-sm font-semibold text-[#F5F7F2]">
                          {ms.titleUz}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full ${
                          isDone
                            ? "bg-[#A3E635]/20 text-[#A3E635]"
                            : isCurrent
                            ? "bg-sky-500/20 text-sky-300"
                            : "bg-white/5 text-[#6B7280]"
                        }`}
                      >
                        {ms.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deliverables Gallery */}
          <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
            <h3 className="text-lg font-bold font-display text-[#F5F7F2]">
              Tayyorlangan materiallar va fayllar (Deliverables)
            </h3>

            {room.deliverables?.length === 0 ? (
              <p className="text-sm text-[#6B7280] italic">
                Hozircha materiallar yuklanmagan.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {room.deliverables?.map((del: any) => (
                  <div
                    key={del.id}
                    className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-[#A3E635]/40 transition space-y-3 bg-[#0D1112]"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-[#050607]">
                      {del.fileUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                        <img
                          src={del.fileUrl}
                          alt={del.titleUz}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#A3E635]">
                          <FileText className="w-10 h-10" />
                        </div>
                      )}
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-[#050607]/80 text-[10px] font-mono text-[#A3E635]">
                        {del.accessLevel}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#F5F7F2] truncate">
                        {del.titleUz}
                      </h4>
                      <p className="text-xs text-[#6B7280] mt-0.5">{del.fileType}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <a
                        href={del.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="glass" size="sm" className="w-full text-xs">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ko'rish</span>
                        </Button>
                      </a>

                      {del.accessLevel === "DOWNLOADABLE" && (
                        <a href={del.fileUrl} download className="flex-1">
                          <Button variant="primary" size="sm" className="w-full text-xs">
                            <Download className="w-3.5 h-3.5" />
                            <span>Yuklash</span>
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Two-Way Chat & Revisions List) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Chat Feed */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 flex flex-col h-[520px]">
            <h3 className="text-base font-bold font-display text-[#F5F7F2] mb-4 pb-3 border-b border-white/5 flex items-center justify-between">
              <span>Loyiha bo'yicha muloqot</span>
              <span className="w-2 h-2 rounded-full bg-[#A3E635] animate-pulse" />
            </h3>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
              {room.messages?.length === 0 ? (
                <p className="text-xs text-[#6B7280] text-center pt-20">
                  Muloqotni boshlash uchun quyida xabar yozing.
                </p>
              ) : (
                room.messages?.map((msg: any) => {
                  const isAdmin = msg.senderType === "ADMIN";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isAdmin ? "items-start" : "items-end"
                      }`}
                    >
                      <span className="text-[10px] font-mono text-[#6B7280] mb-1">
                        {msg.senderName} ({isAdmin ? "Studio" : "Client"})
                      </span>
                      <div
                        className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                          isAdmin
                            ? "bg-white/10 text-[#F5F7F2] rounded-tl-none border border-white/10"
                            : "bg-[#A3E635] text-[#050607] font-medium rounded-tr-none"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Xabar yozing..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 h-10 px-4 rounded-xl bg-[#050607] border border-white/10 text-xs text-[#F5F7F2] focus:outline-none focus:border-[#A3E635]"
              />
              <Button size="icon" variant="primary" type="submit" isLoading={isSendingChat}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Active Revision Requests */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-4">
            <h3 className="text-base font-bold font-display text-[#F5F7F2]">
              O'zgartirish so'rovlari (Revisions)
            </h3>

            {room.revisions?.length === 0 ? (
              <p className="text-xs text-[#6B7280] italic">
                Hozircha o'zgartirish so'rovlari yo'q.
              </p>
            ) : (
              <div className="space-y-3">
                {room.revisions?.map((rev: any) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F5F7F2]">{rev.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        {rev.status}
                      </span>
                    </div>
                    <p className="text-[#9CA3AF] text-[11px]">{rev.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revision Request Modal */}
      <Modal
        isOpen={isRevisionOpen}
        onClose={() => setIsRevisionOpen(false)}
        title="O'zgartirish so'rash (Request Revision)"
        description="Qaysi qismlarni o'zgartirish kerakligini aniq ko'rsating"
      >
        <form onSubmit={handleSubmitRevision} className="space-y-4">
          <Input
            label="Mavzu *"
            placeholder="Masalan: Logotip rangi va 3D kamera burchagi"
            required
            value={revisionForm.title}
            onChange={(e) => setRevisionForm({ ...revisionForm, title: e.target.value })}
          />
          <Textarea
            label="Batafsil tushuntirish *"
            rows={4}
            placeholder="O'zgartirish talablarini bandma-band yozing..."
            required
            value={revisionForm.description}
            onChange={(e) =>
              setRevisionForm({ ...revisionForm, description: e.target.value })
            }
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsRevisionOpen(false)}
            >
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmittingRevision}>
              Yuborish
            </Button>
          </div>
        </form>
      </Modal>

      {/* Project Approval Modal */}
      <Modal
        isOpen={isApprovalOpen}
        onClose={() => setIsApprovalOpen(false)}
        title="Loyihani to'liq tasdiqlash"
        description="Loyiha barcha talablaringizga mos kelganini tasdiqlaysizmi?"
      >
        <div className="space-y-4">
          <Input
            label="Tasdiqlovchi shaxs ismi *"
            value={approvalForm.name}
            onChange={(e) => setApprovalForm({ ...approvalForm, name: e.target.value })}
          />

          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2">
              Hamkorlikdan qoniqish darajasi (Rating)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setApprovalForm({ ...approvalForm, rating: star })}
                  className="p-1 text-[#A3E635]"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= approvalForm.rating ? "fill-[#A3E635]" : "text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="Fikr-mulohaza yoki minnatdorchilik (ixtiyoriy)"
            rows={3}
            placeholder="Ish jarayoni haqida fikringizni bildiring..."
            value={approvalForm.feedback}
            onChange={(e) =>
              setApprovalForm({ ...approvalForm, feedback: e.target.value })
            }
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsApprovalOpen(false)}
            >
              Bekor qilish
            </Button>
            <Button variant="primary" onClick={handleApproveProject} isLoading={isApproving}>
              Tasdiqlash va yakunlash
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
