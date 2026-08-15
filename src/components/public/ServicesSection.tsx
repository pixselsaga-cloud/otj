"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/ui/LanguageSelector";
import { Button } from "@/components/ui/Button";
import { Check, ArrowUpRight, Box, Sparkles, Figma, Compass, Film, Layers } from "lucide-react";

export interface ServiceItem {
  id: string;
  slug: string;
  titleUz: string;
  titleRu: string;
  titleEn: string;
  shortDescUz: string;
  shortDescRu: string;
  shortDescEn: string;
  icon?: string | null;
  startingPrice: string;
  deliveryTime: string;
  category: string;
  featuresUz: string;
  featuresRu: string;
  featuresEn: string;
  featured?: boolean;
}

const serviceIconMap: Record<string, React.ElementType> = {
  Box,
  Sparkles,
  Figma,
  Compass,
  Film,
  Layers,
};

export function ServicesSection({ services = [] }: { services: ServiceItem[] }) {
  const { t, lang } = useLanguage();

  if (!services || services.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden" id="services">
      {/* Background Ambient */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#A3E635]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-sans font-medium text-[#A3E635] tracking-widest uppercase mb-3">
              XIZMATLAR
            </div>
            {/* H2 (Space Grotesk 600) */}
            <h2 className="text-3xl sm:text-5xl font-display font-semibold tracking-tight text-[#F5F7F2]">
              {t.services.title}
            </h2>
          </div>
          {/* Subtitle (Inter 400) */}
          <p className="text-sm sm:text-base font-sans font-normal text-[#9CA3AF] max-w-md">
            {t.services.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = (service.icon && serviceIconMap[service.icon]) || Sparkles;
            const title =
              lang === "ru" ? service.titleRu : lang === "en" ? service.titleEn : service.titleUz;
            const desc =
              lang === "ru" ? service.shortDescRu : lang === "en" ? service.shortDescEn : service.shortDescUz;

            let features: string[] = [];
            try {
              const raw =
                lang === "ru" ? service.featuresRu : lang === "en" ? service.featuresEn : service.featuresUz;
              features = typeof raw === "string" ? JSON.parse(raw) : raw;
            } catch {
              features = [];
            }

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-3xl p-8 glass-panel border transition-all duration-300 flex flex-col justify-between group ${
                  service.featured
                    ? "border-[#A3E635]/40 bg-[#0D1112]/95 shadow-[0_0_30px_rgba(163,230,53,0.12)]"
                    : "border-white/10 hover:border-white/20 bg-[#080A0B]/80"
                }`}
              >
                {service.featured && (
                  <div className="absolute -top-3 right-8 px-3.5 py-0.5 rounded-full bg-[#A3E635] text-[#050607] text-[11px] font-sans font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(163,230,53,0.4)]">
                    Tavsiya etiladi
                  </div>
                )}

                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#A3E635] mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Card Title (Space Grotesk 600) */}
                  <h3 className="text-xl sm:text-2xl font-display font-semibold tracking-tight text-[#F5F7F2] mb-2">
                    {title}
                  </h3>

                  {/* Description (Inter 400) */}
                  <p className="text-xs sm:text-sm font-sans font-normal text-[#9CA3AF] leading-relaxed mb-6">
                    {desc}
                  </p>

                  {/* Features List (Inter 400) */}
                  {features.length > 0 && (
                    <ul className="space-y-2.5 mb-8 border-t border-white/5 pt-6 font-sans">
                      {features.map((feat, fi) => (
                        <li key={fi} className="flex items-start gap-2.5 text-xs font-normal text-[#CBD5E1]">
                          <div className="w-4 h-4 rounded-full bg-[#A3E635]/15 flex items-center justify-center text-[#A3E635] shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Footer Pricing & CTA */}
                <div className="border-t border-white/10 pt-6 mt-auto font-sans">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] uppercase font-mono font-medium text-[#6B7280]">
                        Boshlang'ich narx
                      </p>
                      {/* Big numbers/Price (Space Grotesk 600-700) */}
                      <p className="text-xl font-display font-semibold text-[#A3E635]">
                        {service.startingPrice}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-mono font-medium text-[#6B7280]">
                        Topshirish muddati
                      </p>
                      <p className="text-xs font-sans font-medium text-[#F5F7F2]">
                        {service.deliveryTime}
                      </p>
                    </div>
                  </div>

                  {/* CTA (Inter 500-600) */}
                  <Link href={`/request?service=${encodeURIComponent(title)}`}>
                    <Button
                      variant={service.featured ? "primary" : "outline"}
                      className="w-full justify-between group/btn text-xs font-sans font-medium"
                    >
                      <span>Buyurtma berish</span>
                      <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
