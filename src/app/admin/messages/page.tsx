"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Search, Trash2, Mail, Send, CheckCircle2, Archive, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { formatDateTime } from "@/lib/utils";

export default function AdminMessagesPage() {
  const toast = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Reply Modal
  const [replyingMsg, setReplyingMsg] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/messages?status=${statusFilter}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      toast.error("Xabarlarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingMsg || !replyText.trim()) return;

    setIsSendingReply(true);
    try {
      const res = await fetch(`/api/messages/${replyingMsg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyMessage: replyText.trim() }),
      });

      if (!res.ok) throw new Error("Javob saqlanmadi");
      toast.success("Javob yozildi va xabar statusi 'REPLIED' ga o'zgartirildi!");
      setReplyingMsg(null);
      setReplyText("");
      fetchMessages();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("O'chirishda xatolik");
      toast.success("Xabar savatga yuborildi");
      fetchMessages();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F5F7F2]">
            Inbox Messages
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Saytdagi kontakt shakli orqali kelgan barcha xabarlar va so'rovlar
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-xl bg-[#080A0B] border border-white/10 text-xs text-[#F5F7F2]"
        >
          <option value="ALL">Barcha xabarlar</option>
          <option value="UNREAD">O'qilmagan (Unread)</option>
          <option value="READ">O'qilgan (Read)</option>
          <option value="REPLIED">Javob berilgan (Replied)</option>
        </select>
      </div>

      {/* Messages List */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden bg-[#080A0B]/80 divide-y divide-white/5">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-[#6B7280]">
            Yuklanmoqda...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#9CA3AF]">
            Hozircha xabarlar yo'q.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="p-6 hover:bg-white/[0.02] transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      msg.status === "UNREAD" ? "bg-[#A3E635]" : "bg-white/20"
                    }`}
                  />
                  <h3 className="text-sm font-bold text-[#F5F7F2]">
                    {msg.name}
                  </h3>
                  <span className="text-xs text-[#A3E635] font-mono">
                    {msg.email}
                  </span>
                  {msg.telegram && (
                    <span className="text-xs text-[#6B7280]">
                      ({msg.telegram})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-[#6B7280]">
                    {formatDateTime(msg.createdAt)}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#9CA3AF]">
                    {msg.status}
                  </span>
                </div>
              </div>

              {msg.subject && (
                <p className="text-xs font-bold text-[#F5F7F2]">
                  Mavzu: {msg.subject}
                </p>
              )}

              <p className="text-xs text-[#9CA3AF] leading-relaxed bg-white/[0.01] p-3 rounded-xl border border-white/5">
                {msg.message}
              </p>

              {msg.replyMessage && (
                <div className="p-3 rounded-xl bg-[#A3E635]/5 border border-[#A3E635]/20 text-xs text-[#F5F7F2] space-y-1">
                  <span className="font-bold text-[#A3E635]">Sizning javobingiz:</span>
                  <p>{msg.replyMessage}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  size="sm"
                  variant="glass"
                  className="text-xs"
                  onClick={() => {
                    setReplyingMsg(msg);
                    setReplyText(msg.replyMessage || "");
                  }}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Javob yozish</span>
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-rose-400"
                  onClick={() => handleDelete(msg.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={Boolean(replyingMsg)}
        onClose={() => setReplyingMsg(null)}
        title={`Javob yozish: ${replyingMsg?.name}`}
        description={`Email: ${replyingMsg?.email}`}
      >
        <form onSubmit={handleSendReply} className="space-y-4">
          <Textarea
            label="Javob matni *"
            rows={5}
            placeholder="Mijozga javob xabaringizni yozing..."
            required
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setReplyingMsg(null)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit" isLoading={isSendingReply}>
              Saqlash va Yuborish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
