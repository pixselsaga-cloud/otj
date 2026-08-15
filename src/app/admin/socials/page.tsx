"use client";

import React, { useState, useEffect } from "react";
import { Share2, Plus, Edit, Trash2, Globe, ExternalLink, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export default function AdminSocialsPage() {
  const toast = useToast();
  const [socials, setSocials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    platform: "Instagram",
    username: "@otajon.design",
    url: "https://instagram.com",
    icon: "Instagram",
    labelUz: "Instagram",
    isActive: true,
  });

  const fetchSocials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/socials");
      const data = await res.json();
      setSocials(data.socials || []);
    } catch {
      toast.error("Tarmoqlarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSocials();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/socials/${editingId}` : "/api/socials";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Saqlashda xatolik");
      toast.success(editingId ? "Tarmoq yangilandi!" : "Yangi tarmoq qo'shildi!");
      setIsOpen(false);
      fetchSocials();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("O'chirmoqchimisiz?")) return;
    try {
      await fetch(`/api/socials/${id}`, { method: "DELETE" });
      toast.success("Ijtimoiy tarmoq o'chirildi");
      fetchSocials();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F5F7F2]">
            Social Media CMS
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Sayt bo'ylab barcha ijtimoiy tarmoqlar havolalarini boshqarish (kodga tegmasdan)
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            setEditingId(null);
            setForm({
              platform: "Instagram",
              username: "@username",
              url: "https://",
              icon: "Instagram",
              labelUz: "Instagram",
              isActive: true,
            });
            setIsOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Yangi platforma qo'shish</span>
        </Button>
      </div>

      {/* Social Links List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {socials.map((soc) => (
          <div
            key={soc.id}
            className="p-5 rounded-2xl glass-panel border border-white/10 bg-[#080A0B]/80 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#F5F7F2]">{soc.platform}</span>
                <span className="text-xs font-mono text-[#A3E635]">{soc.username}</span>
              </div>
              <a
                href={soc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#6B7280] hover:text-[#F5F7F2] truncate max-w-xs block mt-1 flex items-center gap-1"
              >
                <span>{soc.url}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-[#A3E635]"
                onClick={() => {
                  setEditingId(soc.id);
                  setForm(soc);
                  setIsOpen(true);
                }}
              >
                <Edit className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-rose-400"
                onClick={() => handleDelete(soc.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingId ? "Tarmoqni tahrirlash" : "Yangi tarmoq qo'shish"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Platforma Nomi *"
            placeholder="Instagram, Telegram, Behance, YouTube..."
            required
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
          />

          <Input
            label="Username *"
            placeholder="@otajon_j"
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <Input
            label="Profil URL Manzili *"
            placeholder="https://t.me/otajon_j"
            required
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
          />

          <Select
            label="Ikonka turi"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          >
            <option value="Instagram">Instagram</option>
            <option value="Send">Telegram (Send)</option>
            <option value="Globe">Behance (Globe)</option>
            <option value="Dribbble">Dribbble</option>
            <option value="Linkedin">LinkedIn</option>
            <option value="Youtube">YouTube</option>
            <option value="Twitter">X / Twitter</option>
            <option value="Github">GitHub</option>
          </Select>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              Saqlash
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
