"use client";

import React, { useState, useEffect } from "react";
import { Workflow, Plus, Edit, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { LanguageField } from "@/components/admin/LanguageField";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";

export default function AdminProcessPage() {
  const toast = useToast();
  const [steps, setSteps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    stepNumber: "01",
    titleUz: "",
    titleRu: "",
    titleEn: "",
    descUz: "",
    descRu: "",
    descEn: "",
    icon: "Compass",
  });

  const fetchSteps = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/process");
      const data = await res.json();
      setSteps(data.steps || []);
    } catch {
      toast.error("Jarayon bosqichlarini yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/process/${editingId}` : "/api/process";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Saqlashda xatolik");
      toast.success(editingId ? "Bosqich yangilandi!" : "Yangi bosqich qo'shildi!");
      setIsOpen(false);
      fetchSteps();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("O'chirmoqchimisiz?")) return;
    try {
      await fetch(`/api/process/${id}`, { method: "DELETE" });
      toast.success("Bosqich o'chirildi");
      fetchSteps();
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
            Workflow Process CMS
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Asosiy sahifadagi 5-bosqichli ishlash metodologiyasi bosqichlarini boshqarish
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => {
            setEditingId(null);
            setForm({
              stepNumber: `0${steps.length + 1}`,
              titleUz: "",
              titleRu: "",
              titleEn: "",
              descUz: "",
              descRu: "",
              descEn: "",
              icon: "Compass",
            });
            setIsOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Yangi bosqich qo'shish</span>
        </Button>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-black font-display text-[#A3E635]">
                {step.stepNumber}
              </span>
              <div>
                <h4 className="text-sm font-bold text-[#F5F7F2]">{step.titleUz}</h4>
                <p className="text-xs text-[#9CA3AF] mt-0.5 max-w-lg">{step.descUz}</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-[#A3E635]"
                onClick={() => {
                  setEditingId(step.id);
                  setForm(step);
                  setIsOpen(true);
                }}
              >
                <Edit className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-rose-400"
                onClick={() => handleDelete(step.id)}
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
        title={editingId ? "Bosqichni tahrirlash" : "Yangi bosqich qo'shish"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Bosqich Raqami *"
            placeholder="01, 02, 03..."
            required
            value={form.stepNumber}
            onChange={(e) => setForm({ ...form, stepNumber: e.target.value })}
          />

          <LanguageField
            label="Bosqich Sarlavhasi"
            values={{ uz: form.titleUz, ru: form.titleRu, en: form.titleEn }}
            onChange={(lang, val) => {
              if (lang === "uz") setForm({ ...form, titleUz: val });
              if (lang === "ru") setForm({ ...form, titleRu: val });
              if (lang === "en") setForm({ ...form, titleEn: val });
            }}
            required
          />

          <LanguageField
            label="Bosqich Tavsifi"
            isTextarea
            rows={3}
            values={{ uz: form.descUz, ru: form.descRu, en: form.descEn }}
            onChange={(lang, val) => {
              if (lang === "uz") setForm({ ...form, descUz: val });
              if (lang === "ru") setForm({ ...form, descRu: val });
              if (lang === "en") setForm({ ...form, descEn: val });
            }}
            required
          />

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
