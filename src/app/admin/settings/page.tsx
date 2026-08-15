"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, Shield, Palette, Sparkles, Image, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { LanguageField } from "@/components/admin/LanguageField";
import { useToast } from "@/components/ui/Toast";

export default function AdminSettingsPage() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    siteTitle: "",
    authorName: "",
    email: "",
    phone: "",
    telegram: "",
    location: "",
    copyright: "",
    primaryColor: "#A3E635",
    accentColor: "#BEF264",
    watermarkText: "OTAJON JAHONGIROV STUDIO",
    watermarkPosition: "BOTTOM_RIGHT",
    watermarkOpacity: 0.35,
    watermarkSize: 16,
    watermarkEnabled: true,
    seoTitleUz: "",
    seoDescUz: "",
    keywordsUz: "",
    canonicalUrl: "https://otj.studio",
  });

  const [newPassword, setNewPassword] = useState("");

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) {
        setSettings({ ...settings, ...data.settings });
      }
    } catch {
      toast.error("Sozlamalarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          newPassword: newPassword.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Sozlamalarni saqlashda xatolik");
      toast.success("Barcha sozlamalar muvaffaqiyatli saqlandi!");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F5F7F2]">
            Site & Brand Settings
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Brend ranglari, Votermark (Watermark), SEO qoidalari va xavfsizlik
          </p>
        </div>

        <Button onClick={handleSave} variant="primary" isLoading={isSaving}>
          <Save className="w-4 h-4" />
          <span>Barcha sozlamalarni saqlash</span>
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. General Info */}
        <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
          <h3 className="text-base font-bold font-display text-[#F5F7F2]">
            1. Asosiy Brend Ma'lumotlari
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Sayt Sarlavhasi (Site Title)"
              value={settings.siteTitle}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
            />
            <Input
              label="Muallif Nomi"
              value={settings.authorName}
              onChange={(e) => setSettings({ ...settings, authorName: e.target.value })}
            />
            <Input
              label="Mualliflik Huquqi (Copyright)"
              value={settings.copyright}
              onChange={(e) => setSettings({ ...settings, copyright: e.target.value })}
            />
            <Input
              label="Kanonik URL (Canonical)"
              value={settings.canonicalUrl}
              onChange={(e) => setSettings({ ...settings, canonicalUrl: e.target.value })}
            />
          </div>
        </div>

        {/* 2. Watermark Settings */}
        <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
          <h3 className="text-base font-bold font-display text-[#F5F7F2]">
            2. Votermark (Watermark) Sozlamalari
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input
              label="Votermark Matni"
              value={settings.watermarkText}
              onChange={(e) => setSettings({ ...settings, watermarkText: e.target.value })}
            />

            <Select
              label="Joylashuv (Position)"
              value={settings.watermarkPosition}
              onChange={(e) => setSettings({ ...settings, watermarkPosition: e.target.value })}
            >
              <option value="BOTTOM_RIGHT">O'ng Pastda (Bottom Right)</option>
              <option value="BOTTOM_LEFT">Chap Pastda (Bottom Left)</option>
              <option value="CENTER">O'rtada (Center - 20° Rotate)</option>
              <option value="TILED">To'r Ko'rinishida (Tiled Grid)</option>
            </Select>

            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] uppercase mb-1">
                Shaffoflik (Opacity: {Math.round(settings.watermarkOpacity * 100)}%)
              </label>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={settings.watermarkOpacity}
                onChange={(e) => setSettings({ ...settings, watermarkOpacity: parseFloat(e.target.value) })}
                className="w-full accent-[#A3E635]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9CA3AF] uppercase mb-1">
                Shrift Hajmi ({settings.watermarkSize}px)
              </label>
              <input
                type="range"
                min="10"
                max="40"
                value={settings.watermarkSize}
                onChange={(e) => setSettings({ ...settings, watermarkSize: parseInt(e.target.value, 10) })}
                className="w-full accent-[#A3E635]"
              />
            </div>
          </div>
        </div>

        {/* 3. Security */}
        <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
          <h3 className="text-base font-bold font-display text-[#F5F7F2]">
            3. Xavfsizlik va Yangi Parol
          </h3>

          <div className="max-w-md">
            <Input
              label="Yangi Admin Paroli (Bo'sh qoldirilsa o'zgarmaydi)"
              type="password"
              placeholder="Yangi kuchli parol kiriting..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
