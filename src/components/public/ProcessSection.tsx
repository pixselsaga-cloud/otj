"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/ui/LanguageSelector";
import { Search, Palette, Layers, CheckCircle, Send, Compass } from "lucide-react";

export interface ProcessStepItem {
  id: string;
  stepNumber: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  descUz: string;
  descRu: string;
  descEn: string;
  icon?: string | null;
}

const processIconMap: Record<string, React.ElementType> = {
  Search,
  Palette,
  Layers,
  CheckCircle,
  Send,
  Compass,
};

export function ProcessSection({ steps = [] }: { steps: ProcessStepItem[] }) {
  const { t, lang } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);

  if (!steps || steps.length === 0) return null;

  return (
    <section className="py-24 relative bg-[#080A0B]/80 border-t border-white/5" id="process">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-sans font-medium text-[#A3E635] tracking-widest uppercase mb-3">
            ISHLASH METODOLOGIYASI
          </div>
          {/* H2 (Space Grotesk 600) */}
          <h2 className="text-3xl sm:text-5xl font-display font-semibold tracking-tight text-[#F5F7F2] mb-3">
            {t.process.title}
          </h2>
          {/* Subtitle (Inter 400) */}
          <p className="text-sm sm:text-base font-sans font-normal text-[#9CA3AF]">
            {t.process.subtitle}
          </p>
        </div>

        {/* 5-Step Process Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-6">
          {steps.map((step, idx) => {
            const Icon = (step.icon && processIconMap[step.icon]) || Compass;
            const title =
              lang === "ru" ? step.titleRu : lang === "en" ? step.titleEn : step.titleUz;
            const desc =
              lang === "ru" ? step.descRu : lang === "en" ? step.descEn : step.descUz;
            const isSelected = activeStep === idx;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                onMouseEnter={() => setActiveStep(idx)}
                className={`relative p-6 sm:p-7 rounded-3xl glass-panel border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "border-[#A3E635] bg-[#0D1112] shadow-[0_0_30px_rgba(163,230,53,0.15)] scale-[1.02]"
                    : "border-white/5 hover:border-white/20 bg-white/[0.02]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {/* Big number (Space Grotesk 600-700) */}
                    <span
                      className={`text-3xl font-display font-bold ${
                        isSelected ? "text-[#A3E635]" : "text-[#6B7280]"
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-[#A3E635]/20 text-[#A3E635]"
                          : "bg-white/5 text-[#9CA3AF]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Title (Space Grotesk 600) */}
                  <h3 className="text-base font-display font-semibold text-[#F5F7F2] mb-2">
                    {title}
                  </h3>

                  {/* Description (Inter 400) */}
                  <p className="text-xs font-sans font-normal text-[#9CA3AF] leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-1.5 font-sans">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? "bg-[#A3E635]" : "bg-white/20"
                    }`}
                  />
                  <span className="text-[10px] font-medium uppercase text-[#6B7280]">
                    Bosqich 0{idx + 1}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
