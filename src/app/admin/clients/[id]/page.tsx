"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Key, Copy, Plus, Send, Trash2, CheckCircle2, RefreshCw, Eye, Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { FileUploader } from "@/components/ui/FileUploader";
import { useToast } from "@/components/ui/Toast";

export default function ClientRoomDetailPage() {
  const params = useParams();
  const toast = useToast();
  const id = params.id as string;

  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Milestone Modal
  const [isMilestoneModal, setIsMilestoneModal] = useState(false);
  const [milestoneTitle, setMilestoneTitle] = useState("");

  // Deliverable Modal
  const [isDeliverableModal, setIsDeliverableModal] = useState(false);
  const [deliverableForm, setDeliverableForm] = useState({
    titleUz: "",
    fileUrl: "",
    fileType: "RENDER",
    accessLevel: "DOWNLOADABLE",
  });

  // Admin Chat Reply
  const [replyMessage, setReplyMessage] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  const fetchClientData = async () => {
    try {
      const res = await fetch(`/api/clients/${id}`);
      if (!res.ok) throw new Error("Mijoz topilmadi");
      const data = await res.json();
      setClient(data.client);
    } catch {
      toast.error("Ma'lumotlarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const room = client?.rooms?.[0];

  const handleRegenerateCode = async () => {
    if (!room) return;
    try {
      const res = await fetch(`/api/clients/${client.id}/code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: room.id }),
      });
      if (!res.ok) throw new Error("Kodni yangilab bo'lmadi");
      const data = await res.json();
      toast.success("Yangi kod yaratildi!", data.accessCode);
      fetchClientData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSendAdminMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !replyMessage.trim()) return;

    setIsSendingReply(true);
    try {
      const res = await fetch(`/api/client-room/${room.accessCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SEND_MESSAGE",
          senderType: "ADMIN",
          senderName: "Otajon Jahongirov",
          content: replyMessage,
        }),
      });

      if (!res.ok) throw new Error("Xabar yuborilmadi");
      setReplyMessage("");
      fetchClientData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSendingReply(false);
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-xs font-mono text-[#6B7280]">Yuklanmoqda...</div>;
  }

  if (!client) {
    return <div className="p-12 text-center text-xs text-rose-400">Mijoz topilmadi.</div>;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/clients">
            <Button size="icon" variant="ghost">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold font-display text-[#F5F7F2]">
              {client.name} — {room?.title || "Mijoz xonasi"}
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              Email: {client.email} {client.phone && `• Tel: ${client.phone}`}
            </p>
          </div>
        </div>

        {room && (
          <div className="flex items-center gap-3">
            <Button size="sm" variant="glass" onClick={handleRegenerateCode}>
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Kodni yangilash</span>
            </Button>

            <Link href={`/client/${room.accessCode}`} target="_blank">
              <Button size="sm" variant="primary">
                <span>Mijoz xonasiga kirish ({room.accessCode})</span>
              </Button>
            </Link>
          </div>
        )}
      </div>

      {room && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Milestones & Deliverables */}
          <div className="lg:col-span-7 space-y-8">
            {/* Milestones */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-display text-[#F5F7F2]">
                  Loyiha bosqichlari (Milestones)
                </h3>
              </div>

              <div className="space-y-3">
                {room.milestones?.map((ms: any, i: number) => (
                  <div
                    key={ms.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[#6B7280]">0{i + 1}</span>
                      <span className="font-semibold text-[#F5F7F2]">{ms.titleUz}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#A3E635]/15 text-[#A3E635]">
                      {ms.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-display text-[#F5F7F2]">
                  Materiallar va Fayllar (Deliverables)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {room.deliverables?.map((del: any) => (
                  <div key={del.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <img src={del.fileUrl} alt={del.titleUz} className="w-full aspect-video rounded-xl object-cover" />
                    <p className="text-xs font-bold text-[#F5F7F2] truncate">{del.titleUz}</p>
                    <span className="text-[10px] font-mono text-[#A3E635]">{del.accessLevel}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Chat Feed */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 flex flex-col h-[520px]">
              <h3 className="text-sm font-bold font-display text-[#F5F7F2] mb-4 pb-3 border-b border-white/5">
                Mijoz bilan Jonli Muloqot (Two-Way Chat)
              </h3>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                {room.messages?.map((msg: any) => {
                  const isAdmin = msg.senderType === "ADMIN";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                    >
                      <span className="text-[10px] font-mono text-[#6B7280] mb-1">
                        {msg.senderName} ({isAdmin ? "Admin" : "Client"})
                      </span>
                      <div
                        className={`p-3 rounded-xl max-w-[85%] text-xs ${
                          isAdmin
                            ? "bg-[#A3E635] text-[#050607] font-medium"
                            : "bg-white/10 text-[#F5F7F2]"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendAdminMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Mijozga javob yozing..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 h-9 px-3 rounded-xl bg-[#050607] border border-white/10 text-xs text-[#F5F7F2] focus:outline-none focus:border-[#A3E635]"
                />
                <Button size="icon" variant="primary" type="submit" isLoading={isSendingReply} className="h-9 w-9">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
