"use client";

import React, { useState } from "react";
import { Mail, Send, Instagram, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/components/ui/LanguageSelector";

export default function ContactPage() {
  const { t } = useLanguage();
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    telegram: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Xabarni yuborishda xatolik yuz berdi");
      }

      setIsSubmitted(true);
      toast.success("Xabaringiz qabul qilindi!", "Tez orada siz bilan bog'lanaman.");
    } catch (err: any) {
      toast.error(err.message || "Xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 font-sans">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-mono font-medium tracking-widest text-[#A3E635] uppercase">
          BEVOSITA ALOQA
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-semibold text-[#F5F7F2]">
          Bog'lanish & Muloqot
        </h1>
        <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
          Yangi loyiha, AI vizualizatsiya yoki hamkorlik bo'yicha to'g'ridan-to'g'ri bog'lanishingiz mumkin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Coordinates & Socials */}
        <div className="lg:col-span-5 space-y-8">
          <div className="p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
            <h3 className="text-lg font-display font-semibold text-[#F5F7F2]">
              To'g'ridan-to'g'ri aloqa kanallari
            </h3>

            <div className="space-y-4 text-xs text-[#9CA3AF]">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#A3E635] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6B7280] uppercase">Manzil</span>
                  <p className="font-semibold text-[#F5F7F2]">Navoiy, O'zbekiston</p>
                </div>
              </div>

              <a href="mailto:pixselsaga@gmail.com" className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#A3E635]/40 transition group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#A3E635] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6B7280] uppercase">Email</span>
                  <p className="font-semibold text-[#F5F7F2] group-hover:text-[#A3E635] transition">pixselsaga@gmail.com</p>
                </div>
              </a>

              <a href="https://t.me/otajon9999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#A3E635]/40 transition group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#A3E635] shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6B7280] uppercase">Telegram</span>
                  <p className="font-semibold text-[#F5F7F2] group-hover:text-[#A3E635] transition">@otajon9999</p>
                </div>
              </a>
            </div>

            {/* Direct Social Icon Action Buttons */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <span className="text-xs font-semibold text-[#F5F7F2]">Ijtimoiy sahifalarimga o'tish:</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://t.me/ustozmee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl glass-panel border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold text-[#F5F7F2] hover:bg-[#A3E635] hover:text-[#050607] hover:border-[#A3E635] transition duration-300 shadow-md"
                  title="Telegram Kanal"
                >
                  <Send className="w-4 h-4" />
                  <span>TG Kanal</span>
                </a>

                <a
                  href="https://t.me/otajon9999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl glass-panel border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold text-[#F5F7F2] hover:bg-[#A3E635] hover:text-[#050607] hover:border-[#A3E635] transition duration-300 shadow-md"
                  title="Telegram Lichka"
                >
                  <Send className="w-4 h-4 text-[#BEF264]" />
                  <span>TG Lichka</span>
                </a>

                <a
                  href="https://instagram.com/ustozmee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl glass-panel border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold text-[#F5F7F2] hover:bg-[#A3E635] hover:text-[#050607] hover:border-[#A3E635] transition duration-300 shadow-md"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-6">
            <h3 className="text-xl font-display font-semibold text-[#F5F7F2]">
              Xabar yoki taklif yuboring
            </h3>

            {isSubmitted ? (
              <div className="p-8 rounded-2xl bg-[#A3E635]/10 border border-[#A3E635]/30 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#A3E635] mx-auto" />
                <h4 className="text-base font-semibold text-[#F5F7F2]">Xabaringiz yuborildi!</h4>
                <p className="text-xs text-[#9CA3AF]">
                  Xabaringiz qabul qilindi. Tez orada javob qaytaraman.
                </p>
                <Button size="sm" variant="glass" onClick={() => setIsSubmitted(false)} className="mt-2">
                  Yana xabar yuborish
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Ismingiz *"
                    placeholder="Sardor Rahimov"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />

                  <Input
                    label="Email Manzil *"
                    type="email"
                    placeholder="sardor@example.com"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Telegram Username"
                    placeholder="@username"
                    value={form.telegram}
                    onChange={(e) => setForm({ ...form, telegram: e.target.value })}
                  />

                  <Input
                    label="Mavzu"
                    placeholder="Yangi loyiha bo'yicha"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>

                <Textarea
                  label="Xabar matni *"
                  rows={5}
                  placeholder="Loyiha g'oyasi, talablaringiz yoki savolingizni yozing..."
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center text-xs font-semibold uppercase tracking-wider"
                  isLoading={isSubmitting}
                >
                  <span>Xabarni yuborish</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
