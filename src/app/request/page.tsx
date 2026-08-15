"use client";

import React, { useState } from "react";
import { useLanguage } from "@/components/ui/LanguageSelector";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Plus, X } from "lucide-react";
import confetti from "canvas-confetti";

export default function RequestPage() {
  const { t } = useLanguage();
  const toast = useToast();

  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    telegram: "",
    phone: "",
    company: "",
    description: "",
    budgetRange: "$3,000 - $5,000",
    deadlineRange: "3-4 hafta",
    referenceLinks: "",
  });

  const [projectTypes, setProjectTypes] = useState<string[]>([
    "3D CGI & Motion",
    "Interior Design",
    "Photo Manipulation",
    "Brand Identity",
    "UI/UX Design",
    "AI Visuals & Direction",
    "Posters & Key Visuals",
  ]);

  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "3D CGI & Motion",
  ]);

  const [newTypeInput, setNewTypeInput] = useState("");
  const [showAddType, setShowAddType] = useState(false);

  const [budgetOptions, setBudgetOptions] = useState<string[]>([
    "$500 - $1,000",
    "$1,000 - $3,000",
    "$3,000 - $5,000",
    "$5,000+",
  ]);
  const [customBudget, setCustomBudget] = useState("");
  const [isCustomBudget, setIsCustomBudget] = useState(false);

  const [deadlineOptions, setDeadlineOptions] = useState<string[]>([
    "3-5 kun (Tezkor)",
    "1-2 hafta",
    "3-4 hafta",
    "Kelishilgan muddat",
  ]);
  const [customDeadline, setCustomDeadline] = useState("");
  const [isCustomDeadline, setIsCustomDeadline] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleAddCustomType = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTypeInput.trim();
    if (!trimmed) return;
    if (!projectTypes.includes(trimmed)) {
      setProjectTypes([...projectTypes, trimmed]);
    }
    if (!selectedTypes.includes(trimmed)) {
      setSelectedTypes([...selectedTypes, trimmed]);
    }
    setNewTypeInput("");
    setShowAddType(false);
    toast.success("Qo'shildi!", `"${trimmed}" loyiha turi ro'yxatga kiritildi`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientName || !formData.email || !formData.description) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return;
    }

    if (selectedTypes.length === 0) {
      toast.error("Kamida bitta loyiha yo'nalishini tanlang yoki o'zingiz kiriting.");
      return;
    }

    const finalBudget = isCustomBudget && customBudget.trim() ? customBudget.trim() : formData.budgetRange;
    const finalDeadline = isCustomDeadline && customDeadline.trim() ? customDeadline.trim() : formData.deadlineRange;

    setIsLoading(true);

    try {
      const res = await fetch("/api/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          budgetRange: finalBudget,
          deadlineRange: finalDeadline,
          projectTypes: selectedTypes,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Briefni yuborishda xatolik yuz berdi");
      }

      setIsSubmitted(true);
      toast.success(t.request.successTitle, t.request.successDesc);

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#A3E635", "#BEF264", "#ffffff"],
        });
      } catch {}
    } catch (err: any) {
      toast.error(err.message || "Xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-[#A3E635] tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" /> AI BRIEF & LOYIHA SO'ROVI
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-semibold tracking-tight text-[#F5F7F2] mb-3">
          {t.request.title}
        </h1>
        <p className="text-sm sm:text-base font-normal text-[#9CA3AF] leading-relaxed">
          {t.request.subtitle}
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-12 rounded-3xl glass-panel border border-[#A3E635]/40 bg-[#0D1112] text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#A3E635]/20 text-[#A3E635] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-semibold text-[#F5F7F2]">
            {t.request.successTitle}
          </h3>
          <p className="text-sm sm:text-base text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
            {t.request.successDesc}
          </p>
          <div className="pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  clientName: "",
                  email: "",
                  telegram: "",
                  phone: "",
                  company: "",
                  description: "",
                  budgetRange: "$3,000 - $5,000",
                  deadlineRange: "3-4 hafta",
                  referenceLinks: "",
                });
                setIsCustomBudget(false);
                setIsCustomDeadline(false);
              }}
            >
              Yangi so'rov yuborish
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Project Types with Custom Variant Addition */}
          <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-semibold text-[#F5F7F2]">
                1. Loyiha yo'nalishi (Bir nechta tanlash yoki o'zingiz kiritishingiz mumkin) *
              </h3>
            </div>

            <div className="flex flex-wrap gap-2.5 items-center">
              {projectTypes.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                      isSelected
                        ? "bg-[#A3E635] text-[#050607] border-[#A3E635] font-semibold shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                        : "glass-panel text-[#9CA3AF] hover:text-[#F5F7F2] border-white/10 hover:border-white/20"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}

              {/* Add Custom Type Button / Input */}
              {showAddType ? (
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-[#A3E635]/40">
                  <input
                    type="text"
                    placeholder="Yo'nalish nomi..."
                    value={newTypeInput}
                    onChange={(e) => setNewTypeInput(e.target.value)}
                    className="bg-transparent px-3 py-1 text-xs text-[#F5F7F2] focus:outline-none w-36"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomType(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomType}
                    className="px-2.5 py-1 rounded-lg bg-[#A3E635] text-[#050607] text-xs font-semibold"
                  >
                    Qo'shish
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddType(false)}
                    className="p-1 text-[#9CA3AF] hover:text-[#F5F7F2]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddType(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium border border-dashed border-[#A3E635]/40 text-[#A3E635] hover:bg-[#A3E635]/10 transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>O'z variantingizni qo'shing</span>
                </button>
              )}
            </div>
          </div>

          {/* 2. Client Coordinates */}
          <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
            <h3 className="text-base font-display font-semibold text-[#F5F7F2]">
              2. Aloqa ma'lumotlari
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Ismingiz *"
                placeholder="Masalan: Sardor Rahimov"
                required
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
              <Input
                label="Email Manzilingiz *"
                type="email"
                placeholder="sardor@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Telegram username"
                placeholder="@username"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
              />
              <Input
                label="Telefon raqamingiz"
                placeholder="+998 90 123 45 67"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Kompaniya yoki brend nomi"
                  placeholder="Apex Technologies"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* 3. Scope & Budget with Custom Variant Addition */}
          <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
            <h3 className="text-base font-display font-semibold text-[#F5F7F2]">
              3. Byudjet va Topshirish muddati
            </h3>

            {/* Budget */}
            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2.5">
                Mo'ljallangan byudjet
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {budgetOptions.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => {
                      setIsCustomBudget(false);
                      setFormData({ ...formData, budgetRange: b });
                    }}
                    className={`py-3 px-4 rounded-xl text-xs font-medium transition border text-center ${
                      !isCustomBudget && formData.budgetRange === b
                        ? "border-[#A3E635] bg-[#A3E635]/15 text-[#A3E635] font-semibold"
                        : "border-white/10 hover:border-white/20 text-[#9CA3AF]"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Custom Budget Input */}
              <div className="mt-3">
                {isCustomBudget ? (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="O'z byudjetingizni yozing (Masalan: $750 yoki Kelishamiz)"
                      value={customBudget}
                      onChange={(e) => setCustomBudget(e.target.value)}
                      className="text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomBudget(false)}
                      className="p-2 text-[#9CA3AF] hover:text-[#F5F7F2]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCustomBudget(true)}
                    className="text-xs text-[#A3E635] hover:underline inline-flex items-center gap-1 font-medium pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Boshqa byudjet kiritish</span>
                  </button>
                )}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2.5">
                Topshirish muddati
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {deadlineOptions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setIsCustomDeadline(false);
                      setFormData({ ...formData, deadlineRange: d });
                    }}
                    className={`py-3 px-4 rounded-xl text-xs font-medium transition border text-center ${
                      !isCustomDeadline && formData.deadlineRange === d
                        ? "border-[#A3E635] bg-[#A3E635]/15 text-[#A3E635] font-semibold"
                        : "border-white/10 hover:border-white/20 text-[#9CA3AF]"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Custom Deadline Input */}
              <div className="mt-3">
                {isCustomDeadline ? (
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="O'z muddatingizni yozing (Masalan: 3 kun ichida yoki 2 oy)"
                      value={customDeadline}
                      onChange={(e) => setCustomDeadline(e.target.value)}
                      className="text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomDeadline(false)}
                      className="p-2 text-[#9CA3AF] hover:text-[#F5F7F2]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCustomDeadline(true)}
                    className="text-xs text-[#A3E635] hover:underline inline-flex items-center gap-1 font-medium pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Boshqa muddat kiritish</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 4. Description & Links */}
          <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
            <h3 className="text-base font-display font-semibold text-[#F5F7F2]">
              4. Loyiha tafsilotlari
            </h3>
            <Textarea
              label="Loyiha tavsifi va asosiy talablar *"
              rows={5}
              placeholder="Mahsulot haqida, qanday natija kutayotganingiz va asosiy maqsadlaringizni tasvirlab bering..."
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <Input
              label="Havolalar yoki reference materiallar (Figma, Dribbble, Drive, Web)"
              placeholder="https://figma.com/..., https://behance.net/..."
              value={formData.referenceLinks}
              onChange={(e) => setFormData({ ...formData, referenceLinks: e.target.value })}
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-2 text-xs text-[#6B7280]">
              <ShieldCheck className="w-4 h-4 text-[#A3E635]" />
              <span>Ma'lumotlaringiz maxfiy va xavfsiz saqlanadi</span>
            </div>

            <Button size="lg" variant="primary" type="submit" isLoading={isLoading} className="font-semibold text-xs uppercase tracking-wider">
              <span>{t.request.submit}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
