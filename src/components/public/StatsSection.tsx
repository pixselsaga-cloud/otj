"use client";

import React from "react";
import { motion } from "framer-motion";
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
    <section className="py-14 relative border-y border-white/5 bg-[#080A0B]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((item, index) => {
            const Icon = (item.icon && iconMap[item.icon]) || TrendingUp;
            const label =
              lang === "ru" ? item.labelRu : lang === "en" ? item.labelEn : item.labelUz;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative p-6 rounded-3xl glass-panel border border-white/5 hover:border-[#A3E635]/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#A3E635] group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-[#6B7280]">0{index + 1}</span>
                </div>

                {/* Big numbers (Space Grotesk 600-700) */}
                <div className="flex items-baseline gap-1 font-display">
                  {item.prefix && (
                    <span className="text-2xl sm:text-3xl font-semibold text-[#A3E635]">
                      {item.prefix}
                    </span>
                  )}
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F7F2]">
                    {item.value}
                  </span>
                  {item.suffix && (
                    <span className="text-2xl sm:text-3xl font-semibold text-[#A3E635]">
                      {item.suffix}
                    </span>
                  )}
                </div>

                {/* Label (Inter 400-500) */}
                <p className="text-xs sm:text-sm font-sans font-medium text-[#9CA3AF] mt-2">
                  {label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
