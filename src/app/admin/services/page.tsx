"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Sparkles, Check, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { LanguageField } from "@/components/admin/LanguageField";
import { useToast } from "@/components/ui/Toast";

export default function AdminServicesPage() {
  const toast = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit/Create Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    titleUz: "",
    titleRu: "",
    titleEn: "",
    shortDescUz: "",
    shortDescRu: "",
    shortDescEn: "",
    startingPrice: "$1,500",
    deliveryTime: "2-3 hafta",
    category: "3D & Motion",
    icon: "Sparkles",
    featuresUz: [] as string[],
    featuresRu: [] as string[],
    featuresEn: [] as string[],
    featured: false,
    status: "PUBLISHED",
  });

  const [featureInput, setFeatureInput] = useState("");

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.services || []);
    } catch {
      toast.error("Xizmatlarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenNew = () => {
    setEditingId(null);
    setForm({
      titleUz: "",
      titleRu: "",
      titleEn: "",
      shortDescUz: "",
      shortDescRu: "",
      shortDescEn: "",
      startingPrice: "$1,500",
      deliveryTime: "2-3 hafta",
      category: "3D & Motion",
      icon: "Sparkles",
      featuresUz: [],
      featuresRu: [],
      featuresEn: [],
      featured: false,
      status: "PUBLISHED",
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (srv: any) => {
    setEditingId(srv.id);
    let fUz = [];
    let fRu = [];
    let fEn = [];
    try {
      fUz = typeof srv.featuresUz === "string" ? JSON.parse(srv.featuresUz) : srv.featuresUz || [];
      fRu = typeof srv.featuresRu === "string" ? JSON.parse(srv.featuresRu) : srv.featuresRu || [];
      fEn = typeof srv.featuresEn === "string" ? JSON.parse(srv.featuresEn) : srv.featuresEn || [];
    } catch {}

    setForm({
      titleUz: srv.titleUz || "",
      titleRu: srv.titleRu || "",
      titleEn: srv.titleEn || "",
      shortDescUz: srv.shortDescUz || "",
      shortDescRu: srv.shortDescRu || "",
      shortDescEn: srv.shortDescEn || "",
      startingPrice: srv.startingPrice || "$1,000",
      deliveryTime: srv.deliveryTime || "2-3 hafta",
      category: srv.category || "Design",
      icon: srv.icon || "Sparkles",
      featuresUz: fUz,
      featuresRu: fRu,
      featuresEn: fEn,
      featured: Boolean(srv.featured),
      status: srv.status || "PUBLISHED",
    });
    setIsOpen(true);
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setForm({
      ...form,
      featuresUz: [...form.featuresUz, featureInput.trim()],
      featuresRu: [...form.featuresRu, featureInput.trim()],
      featuresEn: [...form.featuresEn, featureInput.trim()],
    });
    setFeatureInput("");
  };

  const removeFeature = (idx: number) => {
    setForm({
      ...form,
      featuresUz: form.featuresUz.filter((_, i) => i !== idx),
      featuresRu: form.featuresRu.filter((_, i) => i !== idx),
      featuresEn: form.featuresEn.filter((_, i) => i !== idx),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titleUz || !form.shortDescUz) {
      toast.error("Iltimos, sarlavha va qisqa tavsifni kiriting.");
      return;
    }

    setIsSaving(true);
    try {
      const url = editingId ? `/api/services/${editingId}` : "/api/services";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Saqlashda xatolik");
      toast.success(editingId ? "Xizmat yangilandi!" : "Yangi xizmat qo'shildi!");
      setIsOpen(false);
      fetchServices();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ushbu xizmatni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("O'chirishda xatolik");
      toast.success("Xizmat savatga yuborildi");
      fetchServices();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F5F7F2]">
            Services CMS
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Xizmatlar katalogi, narxlar va xususiyatlar ro'yxatini boshqarish
          </p>
        </div>

        <Button size="sm" variant="primary" onClick={handleOpenNew}>
          <Plus className="w-4 h-4" />
          <span>Yangi xizmat qo'shish</span>
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => {
          let feats = [];
          try {
            feats = typeof srv.featuresUz === "string" ? JSON.parse(srv.featuresUz) : srv.featuresUz || [];
          } catch {}

          return (
            <div
              key={srv.id}
              className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 flex flex-col justify-between space-y-6"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/5 text-[#A3E635]">
                    {srv.category}
                  </span>
                  <span className="text-xs font-bold font-mono text-[#F5F7F2]">
                    {srv.startingPrice}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display text-[#F5F7F2] mb-2">
                  {srv.titleUz}
                </h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed line-clamp-2">
                  {srv.shortDescUz}
                </p>

                {feats.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                    {feats.slice(0, 3).map((f: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-[#9CA3AF]">
                        <Check className="w-3 h-3 text-[#A3E635] shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-[11px] font-mono text-[#6B7280]">
                  Muddat: {srv.deliveryTime}
                </span>

                <div className="flex items-center gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-[#A3E635]" onClick={() => handleOpenEdit(srv)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-400" onClick={() => handleDelete(srv.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Editor */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={editingId ? "Xizmatni tahrirlash" : "Yangi xizmat yaratish"}
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <LanguageField
            label="Xizmat nomi"
            values={{ uz: form.titleUz, ru: form.titleRu, en: form.titleEn }}
            onChange={(lang, val) => {
              if (lang === "uz") setForm({ ...form, titleUz: val });
              if (lang === "ru") setForm({ ...form, titleRu: val });
              if (lang === "en") setForm({ ...form, titleEn: val });
            }}
            required
          />

          <LanguageField
            label="Qisqa tavsif"
            isTextarea
            rows={2}
            values={{ uz: form.shortDescUz, ru: form.shortDescRu, en: form.shortDescEn }}
            onChange={(lang, val) => {
              if (lang === "uz") setForm({ ...form, shortDescUz: val });
              if (lang === "ru") setForm({ ...form, shortDescRu: val });
              if (lang === "en") setForm({ ...form, shortDescEn: val });
            }}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Boshlang'ich Narx"
              placeholder="$1,500"
              value={form.startingPrice}
              onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
            />
            <Input
              label="Yetkazish muddati"
              placeholder="2-3 hafta"
              value={form.deliveryTime}
              onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
            />
            <Input
              label="Kategoriya"
              placeholder="3D & Motion"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>

          {/* Features Builder */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase">
              Xizmat tarkibi (Features)
            </label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Yangi band qo'shing (masalan: 8K Ultra-HD Renderlar)..."
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
              />
              <Button type="button" variant="glass" size="md" onClick={addFeature}>
                Qo'shish
              </Button>
            </div>

            <div className="space-y-1.5 pt-2">
              {form.featuresUz.map((feat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white/5 text-xs text-[#F5F7F2]">
                  <span>{feat}</span>
                  <button type="button" onClick={() => removeFeature(idx)} className="text-rose-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" type="button" onClick={() => setIsOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit" isLoading={isSaving}>
              Saqlash
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
