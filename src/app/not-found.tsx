"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center pt-28 pb-16 px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl glass-panel border border-[#A3E635]/30 flex items-center justify-center mx-auto text-4xl font-extrabold font-display text-[#A3E635] shadow-[0_0_30px_rgba(163,230,53,0.2)]">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold font-display text-[#F5F7F2]">
            Sahifa topilmadi
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            Siz qidirayotgan sahifa o'chirilgan, nomi o'zgartirilgan yoki vaqtincha mavjud emas.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link href="/">
            <Button size="md" variant="primary">
              <Home className="w-4 h-4" />
              <span>Bosh sahifaga qaytish</span>
            </Button>
          </Link>
          <Link href="/works">
            <Button size="md" variant="glass">
              <span>Ishlar katalogi</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
