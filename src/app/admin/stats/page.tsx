"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { LanguageField } from "@/components/admin/LanguageField";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export default function AdminStatsPage() {
  const toast = useToast();
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    labelUz: "",
    labelRu: "",
    labelEn: "",
    value: "100",
    prefix: "",
    suffix: "+",
    icon: "TrendingUp",
    isVisible: true,
  });

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data.stats || []);
    } catch {
      toast.error("Statistikalarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/stats/${editingId}` : "/api/stats";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Saqlashda xatolik");
      toast.success(editingId ? "Statistika yangilandi!" : "Yangi statistika qo'shildi!");
      setIsOpen(false);
      fetchStats();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("O'chirmoqchimisiz?")) return;
    try {
      await fetch(`/api/stats/${id}`, { method: "DELETE" });
      toast.success("Statistika o'chirildi");
      fetchStats();
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
            Live Statistics CMS
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Asosiy sahifadagi jonli ko'rsatkichlar va raqamlar (Zero Hardcoded Data)
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            setEditingId(null);
            setForm({
              labelUz: "",
              labelRu: "",
              labelEn: "",
              value: "100",
              prefix: "",
              suffix: "+",
              icon: "TrendingUp",
              isVisible: true,
            });
            setIsOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Yangi ko'rsatkich qo'shish</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((st) => (
          <div
            key={st.id}
            className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 flex items-center justify-between"
          >
            <div>
              <div className="flex items-baseline gap-1 font-display font-black text-2xl text-[#F5F7F2]">
                {st.prefix && <span className="text-[#A3E635]">{st.prefix}</span>}
                <span>{st.value}</span>
                {st.suffix && <span className="text-[#A3E635]">{st.suffix}</span>}
              </div>
              <p className="text-xs text-[#9CA3AF] mt-1">{st.labelUz}</p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-[#A3E635]"
                onClick={() => {
                  setEditingId(st.id);
                  setForm(st);
                  setIsOpen(true);
                }}
              >
                <Edit className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-rose-400"
                onClick={() => handleDelete(st.id)}
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
        title={editingId ? "Statistikani tahrirlash" : "Yangi ko'rsatkich qo'shish"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <LanguageField
            label="Ko'rsatkich Nomi (Label)"
            values={{ uz: form.labelUz, ru: form.labelRu, en: form.labelEn }}
            onChange={(lang, val) => {
              if (lang === "uz") setForm({ ...form, labelUz: val });
              if (lang === "ru") setForm({ ...form, labelRu: val });
              if (lang === "en") setForm({ ...form, labelEn: val });
            }}
            required
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Old qo'shimcha (Prefix)"
              placeholder="$ yoki +"
              value={form.prefix || ""}
              onChange={(e) => setForm({ ...form, prefix: e.target.value })}
            />
            <Input
              label="Qiymat (Value) *"
              placeholder="120"
              required
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
            />
            <Input
              label="Orqa qo'shimcha (Suffix)"
              placeholder="+ yoki %"
              value={form.suffix || ""}
              onChange={(e) => setForm({ ...form, suffix: e.target.value })}
            />
          </div>

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
