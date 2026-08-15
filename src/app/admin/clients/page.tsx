"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Users, ShieldCheck, Key, ExternalLink, Trash2, Edit, Copy, CheckCircle2, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { formatDateTime } from "@/lib/utils";

export default function AdminClientsPage() {
  const toast = useToast();
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Client Modal
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    telegram: "",
    createRoom: true,
    roomTitle: "",
    welcomeMessage: "",
    deadline: "",
  });

  // Direct Message Modal
  const [isMessageModal, setIsMessageModal] = useState(false);
  const [selectedRoomCode, setSelectedRoomCode] = useState("");
  const [directMessageText, setDirectMessageText] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data.clients || []);
    } catch {
      toast.error("Mijozlarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Ism va Email majburiy");
      return;
    }

    setIsCreating(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Mijoz yaratishda xatolik");
      toast.success("Mijoz va xona muvaffaqiyatli yaratildi!");
      setIsOpen(false);
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        telegram: "",
        createRoom: true,
        roomTitle: "",
        welcomeMessage: "",
        deadline: "",
      });
      fetchClients();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomCode || !directMessageText.trim()) return;

    setIsSendingMessage(true);
    try {
      const res = await fetch(`/api/client-room/${selectedRoomCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SEND_MESSAGE",
          senderType: "ADMIN",
          senderName: "Otajon Jahongirov",
          content: directMessageText.trim(),
        }),
      });

      if (!res.ok) throw new Error("Xabar yuborilmadi");
      toast.success("Xabar mijoz xonasiga muvaffaqiyatli yuborildi!");
      setIsMessageModal(false);
      setDirectMessageText("");
      fetchClients();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const copyRoomUrl = (code: string) => {
    const url = `${window.location.origin}/client/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Xona havolasi nusxalandi!", url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F5F7F2]">
            Clients & Private Rooms
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Maxsus xonalar, to'g'ridan-to'g'ri xabar yuborish, bosqichlar va topshiriladigan materiallar
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="glass"
            onClick={() => {
              const firstWithRoom = clients.find((c) => c.rooms?.[0]);
              if (firstWithRoom) {
                setSelectedRoomCode(firstWithRoom.rooms[0].accessCode);
              }
              setIsMessageModal(true);
            }}
          >
            <Send className="w-4 h-4" />
            <span>Mijozga xabar yuborish</span>
          </Button>

          <Button size="sm" variant="primary" onClick={() => setIsOpen(true)}>
            <Plus className="w-4 h-4" />
            <span>Yangi mijoz xonasi</span>
          </Button>
        </div>
      </div>

      {/* Clients List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clients.map((client) => {
          const room = client.rooms?.[0];

          return (
            <div
              key={client.id}
              className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold font-display text-[#F5F7F2]">
                      {client.name}
                    </h3>
                    <p className="text-xs text-[#A3E635] font-semibold">
                      {client.company || "Individual Mijoz"}
                    </p>
                  </div>

                  <span className="text-xs font-mono text-[#6B7280]">
                    {client.email}
                  </span>
                </div>

                {room ? (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F5F7F2]">{room.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#A3E635]/15 text-[#A3E635] font-bold">
                        {room.accessCode}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-[#6B7280]">
                        <span>Loyiha Progressi</span>
                        <span>{room.progress}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#A3E635] h-full rounded-full" style={{ width: `${room.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#6B7280] italic">
                    Ushbu mijoz uchun faol xona ochilmagan.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                {room && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="glass"
                      onClick={() => {
                        setSelectedRoomCode(room.accessCode);
                        setIsMessageModal(true);
                      }}
                      className="text-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Xabar yozish</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyRoomUrl(room.accessCode)}
                      className="text-xs"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Havola</span>
                    </Button>
                  </div>
                )}

                <Link href={`/admin/clients/${client.id}`}>
                  <Button size="sm" variant="primary" className="text-xs">
                    <span>Xonani Boshqarish</span>
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Message Modal */}
      <Modal
        isOpen={isMessageModal}
        onClose={() => setIsMessageModal(false)}
        title="Mijozga To'g'ridan-to'g'ri Xabar Yuborish"
        description="Xabar mijozning shaxsiy xonasidagi jonli muloqot oynasida darhol ko'rinadi"
      >
        <form onSubmit={handleSendDirectMessage} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase mb-1.5">
              Qaysi mijoz xonasiga? *
            </label>
            <select
              value={selectedRoomCode}
              onChange={(e) => setSelectedRoomCode(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#050607] border border-white/10 text-xs text-[#F5F7F2] focus:outline-none focus:border-[#A3E635]"
              required
            >
              {clients
                .filter((c) => c.rooms?.[0])
                .map((c) => (
                  <option key={c.id} value={c.rooms[0].accessCode}>
                    {c.name} ({c.company || "Individual"}) — Kod: {c.rooms[0].accessCode}
                  </option>
                ))}
            </select>
          </div>

          <Textarea
            label="Xabar matni *"
            rows={4}
            placeholder="Assalomu alaykum! Loyihangiz bo'yicha yangi materiallar tayyor bo'ldi..."
            required
            value={directMessageText}
            onChange={(e) => setDirectMessageText(e.target.value)}
            autoFocus
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsMessageModal(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit" isLoading={isSendingMessage}>
              <Send className="w-3.5 h-3.5" />
              <span>Yuborish</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* New Client Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Yangi mijoz va xona ochish"
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Mijoz To'liq Ismi *"
            placeholder="Sardor Rahimov"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Input
            label="Kompaniya yoki Brend"
            placeholder="Apex Innovations"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Manzil *"
              type="email"
              placeholder="sardor@apex.io"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Telegram"
              placeholder="@sardor_apex"
              value={form.telegram}
              onChange={(e) => setForm({ ...form, telegram: e.target.value })}
            />
          </div>

          <div className="pt-2 border-t border-white/5 space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-[#F5F7F2]">
              <input
                type="checkbox"
                checked={form.createRoom}
                onChange={(e) => setForm({ ...form, createRoom: e.target.checked })}
                className="w-4 h-4 rounded text-[#A3E635]"
              />
              <span>Ushbu mijoz uchun maxsus Client Room ochish</span>
            </label>

            {form.createRoom && (
              <div className="space-y-3 pt-2">
                <Input
                  label="Xona Sarlavhasi"
                  placeholder="Apex Next-Gen Brand Suite"
                  value={form.roomTitle}
                  onChange={(e) => setForm({ ...form, roomTitle: e.target.value })}
                />
                <Textarea
                  label="Xush kelibsiz xabari"
                  rows={2}
                  placeholder="Xush kelibsiz! Loyihangizning barcha materiallari shu yerda joylashtiriladi..."
                  value={form.welcomeMessage}
                  onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" type="button" onClick={() => setIsOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit" isLoading={isCreating}>
              Yaratish
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
