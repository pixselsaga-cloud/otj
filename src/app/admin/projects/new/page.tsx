"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, UploadCloud, Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { LanguageField } from "@/components/admin/LanguageField";
import { FileUploader } from "@/components/ui/FileUploader";
import { useToast } from "@/components/ui/Toast";

export default function NewProjectPage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    titleUz: "",
    titleRu: "",
    titleEn: "",
    slug: "",
    descUz: "",
    descRu: "",
    descEn: "",
    fullDescUz: "",
    fullDescRu: "",
    fullDescEn: "",
    client: "",
    category: "3D CGI & Motion",
    customCategory: "",
    year: new Date().getFullYear().toString(),
    location: "Tashkent, UZ",
    services: "3D CGI, Lighting, Shaders",
    tools: "Cinema 4D, Octane, Photoshop",
    tags: "3d, luxury, cgi",
    coverImage: "",
    gallery: [] as string[],
    status: "PUBLISHED",
    featured: false,
    watermarkEnabled: true,
  });

  const categories = [
    "3D CGI & Motion",
    "Interior Design",
    "Photo Manipulation",
    "Brand Identity",
    "UI/UX Design",
    "Architecture & 3D Render",
    "Posters & Key Visuals",
    "Motion Graphics",
    "Boshqa (Yangi kategoriya kiritish)",
  ];

  const handleGalleryUpload = (file: any) => {
    setForm((prev) => ({
      ...prev,
      gallery: [...prev.gallery, file.publicUrl],
    }));
    toast.success("Rasm galereyaga qo'shildi!");
  };

  const removeGalleryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.titleUz) {
      toast.error("Loyiha nomini kiriting");
      return;
    }

    if (!form.coverImage) {
      toast.error("Iltimos, asosiy muqova rasmini yuklang yoki URL kiriting");
      return;
    }

    const finalCategory =
      form.category === "Boshqa (Yangi kategoriya kiritish)" && form.customCategory.trim()
        ? form.customCategory.trim()
        : form.category;

    setIsLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          category: finalCategory,
          titleRu: form.titleRu || form.titleUz,
          titleEn: form.titleEn || form.titleUz,
          descRu: form.descRu || form.descUz,
          descEn: form.descEn || form.descUz,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Loyihani saqlashda xatolik");
      }

      toast.success("Loyiha muvaffaqiyatli yaratildi va e'lon qilindi!");
      router.push("/admin/projects");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/projects">
            <Button size="icon" variant="ghost">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold font-display text-[#F5F7F2]">
              Yangi loyiha yuklash & yaratish
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              Rasmlarni to'g'ridan-to'g'ri kompyuteringizdan yuklang, kategoriya tanlang va darhol e'lon qiling
            </p>
          </div>
        </div>

        <Button onClick={handleSubmit} variant="primary" isLoading={isLoading}>
          <Save className="w-4 h-4" />
          <span>Saytga chiqarish (Publish)</span>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Category & General Info */}
        <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
          <h3 className="text-base font-bold font-display text-[#F5F7F2]">
            1. Kategoriya va Asosiy parametrlar
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-1.5">
                Kategoriya Tanlang *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-11 px-4 rounded-xl bg-[#050607] border border-white/10 text-xs text-[#F5F7F2] focus:outline-none focus:border-[#A3E635]"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {form.category === "Boshqa (Yangi kategoriya kiritish)" && (
              <Input
                label="Yangi Kategoriya Nomi *"
                placeholder="Masalan: Concept Art, Automotive..."
                value={form.customCategory}
                onChange={(e) => setForm({ ...form, customCategory: e.target.value })}
                required
              />
            )}

            <Input
              label="Mijoz yoki Kompaniya (Client)"
              placeholder="Masalan: Archline Studio yoki Shaxsiy"
              value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })}
            />

            <Input
              label="Yil"
              placeholder="2026"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </div>
        </div>

        {/* 2. Direct File Upload (Cover & Gallery) */}
        <div className="p-8 rounded-3xl glass-panel border border-[#A3E635]/20 bg-[#080A0B]/80 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-[#F5F7F2]">
                2. Rasmlarni yuklash (Cover & Galereya)
              </h3>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Kompyuteringizdagi rasmlarni shu yerga tashlang yoki tanlang
              </p>
            </div>
            <span className="text-xs font-mono text-[#A3E635] font-bold">Auto-Upload System</span>
          </div>

          {/* Cover Image */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
              Asosiy Muqova Rasmi (Cover Image) *
            </label>

            {form.coverImage ? (
              <div className="relative rounded-2xl overflow-hidden glass-panel border border-white/10 aspect-video max-w-md group">
                <img src={form.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, coverImage: "" })}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-rose-500 text-white shadow-lg"
                  title="Rasmni o'chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <FileUploader
                onUploadSuccess={(file) => {
                  setForm({ ...form, coverImage: file.publicUrl });
                  toast.success("Muqova rasmi muvaffaqiyatli yuklandi!");
                }}
                category="Project Cover"
              />
            )}
          </div>

          {/* Gallery Images */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <label className="block text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
              Qo'shimcha Galereya Rasmlari (Case Study Gallery)
            </label>

            <FileUploader
              onUploadSuccess={handleGalleryUpload}
              multiple={true}
              category="Project Gallery"
            />

            {form.gallery.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {form.gallery.map((imgUrl, i) => (
                  <div key={i} className="relative rounded-2xl overflow-hidden glass-panel border border-white/10 group aspect-video">
                    <img src={imgUrl} alt={`gallery ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition shadow-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. Title & Descriptions */}
        <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
          <h3 className="text-base font-bold font-display text-[#F5F7F2]">
            3. Loyiha nomi va Tavsifi
          </h3>

          <LanguageField
            label="Loyiha Sarlavhasi (Title)"
            values={{ uz: form.titleUz, ru: form.titleRu, en: form.titleEn }}
            onChange={(lang, val) => {
              if (lang === "uz") setForm({ ...form, titleUz: val });
              if (lang === "ru") setForm({ ...form, titleRu: val });
              if (lang === "en") setForm({ ...form, titleEn: val });
            }}
            required
          />

          <LanguageField
            label="Qisqa tavsif (Card Description)"
            isTextarea
            rows={3}
            values={{ uz: form.descUz, ru: form.descRu, en: form.descEn }}
            onChange={(lang, val) => {
              if (lang === "uz") setForm({ ...form, descUz: val });
              if (lang === "ru") setForm({ ...form, descRu: val });
              if (lang === "en") setForm({ ...form, descEn: val });
            }}
          />

          <LanguageField
            label="To'liq Case Study matni"
            isTextarea
            rows={5}
            values={{ uz: form.fullDescUz, ru: form.fullDescRu, en: form.fullDescEn }}
            onChange={(lang, val) => {
              if (lang === "uz") setForm({ ...form, fullDescUz: val });
              if (lang === "ru") setForm({ ...form, fullDescRu: val });
              if (lang === "en") setForm({ ...form, fullDescEn: val });
            }}
          />
        </div>

        {/* 4. Tools & Features */}
        <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
          <h3 className="text-base font-bold font-display text-[#F5F7F2]">
            4. Asboblar va Qo'shimcha Sozlamalar
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Ishlatilgan Asboblar (Tools)"
              placeholder="3ds Max, Corona Render, Photoshop"
              value={form.tools}
              onChange={(e) => setForm({ ...form, tools: e.target.value })}
            />

            <Input
              label="Xizmatlar (Services)"
              placeholder="Interior CGI, Lighting, Shaders"
              value={form.services}
              onChange={(e) => setForm({ ...form, services: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#F5F7F2]">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 rounded text-[#A3E635] focus:ring-[#A3E635] bg-[#050607] border-white/10"
              />
              <span>Asosiy sahifada ajratib ko'rsatish (Featured)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#F5F7F2]">
              <input
                type="checkbox"
                checked={form.watermarkEnabled}
                onChange={(e) => setForm({ ...form, watermarkEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-[#A3E635] focus:ring-[#A3E635] bg-[#050607] border-white/10"
              />
              <span>Votermark qo'yish (Watermark Enabled)</span>
            </label>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link href="/admin/projects">
            <Button variant="ghost">Bekor qilish</Button>
          </Link>
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading}>
            <Save className="w-4 h-4" />
            <span>Saytga chiqarish</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
