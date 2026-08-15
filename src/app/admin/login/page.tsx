"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { ShieldCheck, ArrowRight, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const toast = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error("Login va parolni kiriting");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Tizimga kirishda xatolik");
      }

      toast.success("Xush kelibsiz!", "Admin boshqaruv paneliga kirdingiz.");
      router.push("/admin");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#050607] font-sans">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#A3E635]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-panel border border-white/10 bg-[#0D1112]/95 shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/30 text-[#A3E635] flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold font-display text-[#F5F7F2]">
            OTJ Studio CMS
          </h1>
          <p className="text-xs text-[#9CA3AF]">
            Boshqaruv paneliga kirish uchun ma'lumotlaringizni tasdiqlang
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 pt-2">
          <Input
            label="Login yoki Email (Username)"
            placeholder="Otajon2009$ yoki admin@otj.studio"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Parol"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full justify-center mt-2 font-semibold text-xs uppercase tracking-wider"
            isLoading={isLoading}
          >
            <span>Tizimga kirish</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>
      </div>
    </div>
  );
}
