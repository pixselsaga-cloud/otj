"use client";

import React from "react";
import { useLanguage } from "@/components/ui/LanguageSelector";
import { Briefcase, Heart, Globe, Trophy, Sparkles, TrendingUp } from "lucide-react";

export interface StatisticItem {
  id: string;
  labelUz: string;
  labelRu: string;
  labelEn: string;
  value: string;
  prefix?: string | null;
  suffix?: string | null;
  icon?: string | null;
}

const iconMap: Record<string, React.ElementType> = {
  Briefcase,
  Heart,
  Globe,
  Trophy,
  Sparkles,
  TrendingUp,
};

export function StatsSection({ stats = [] }: { stats: StatisticItem[] }) {
  const { lang } = useLanguage();

  if (!stats || stats.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 relative border-y border-white/5 bg-[#080A0B]/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
          {stats.map((item, index) => {
            const Icon = (item.icon && iconMap[item.icon]) || TrendingUp;
            const label =
              lang === "ru" ? item.labelRu : lang === "en" ? item.labelEn : item.labelUz;

            return (
              <div
                key={item.id}
                className="relative p-4 sm:p-6 rounded-2xl sm:rounded-3xl glass-panel border border-white/5 hover:border-[#A3E635]/30 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#A3E635]">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-[#6B7280]">0{index + 1}</span>
                </div>

                {/* Numbers */}
                <div className="flex items-baseline gap-0.5 sm:gap-1 font-display">
                  {item.prefix && (
                    <span className="text-lg sm:text-2xl font-semibold text-[#A3E635]">
                      {item.prefix}
                    </span>
                  )}
                  <span className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F7F2]">
                    {item.value}
                  </span>
                  {item.suffix && (
                    <span className="text-lg sm:text-2xl font-semibold text-[#A3E635]">
                      {item.suffix}
                    </span>
                  )}
                </div>

                {/* Label */}
                <p className="text-[11px] sm:text-xs font-sans font-medium text-[#9CA3AF] mt-1 sm:mt-2 line-clamp-1">
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
