"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/ui/LanguageSelector";
import { Star, Quote } from "lucide-react";

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  clientAvatar?: string | null;
  contentUz: string;
  contentRu: string;
  contentEn: string;
  rating: number;
}

export function Testimonials({ reviews = [] }: { reviews: TestimonialItem[] }) {
  const { lang } = useLanguage();

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-sans font-medium text-[#A3E635] tracking-widest uppercase mb-3">
              MIJOZLAR FIKRI
            </div>
            {/* H2 (Space Grotesk 600) */}
            <h2 className="text-3xl sm:text-5xl font-display font-semibold tracking-tight text-[#F5F7F2]">
              Mijozlar fikrlari
            </h2>
          </div>
          {/* Subtitle (Inter 400) */}
          <p className="text-sm sm:text-base font-sans font-normal text-[#9CA3AF] max-w-md">
            Xalqaro va mahalliy brendlar bilan amalga oshirilgan muvaffaqiyatli hamkorliklar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {reviews.map((review, i) => {
            const content =
              lang === "ru"
                ? review.contentRu
                : lang === "en"
                ? review.contentEn
                : review.contentUz;

            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-8 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/85 flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, r) => (
                        <Star key={r} className="w-4 h-4 fill-[#A3E635] text-[#A3E635]" />
                      ))}
                    </div>
                    <Quote className="w-6 h-6 text-white/15" />
                  </div>

                  {/* Review Text (Inter 400) */}
                  <p className="text-sm sm:text-base font-sans font-normal text-[#CBD5E1] leading-relaxed italic mb-8">
                    "{content}"
                  </p>
                </div>

                {/* Client Profile */}
                <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                  {review.clientAvatar ? (
                    <img
                      src={review.clientAvatar}
                      alt={review.clientName}
                      className="w-11 h-11 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-sans font-semibold text-xs text-[#A3E635]">
                      {review.clientName.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    {/* Client Name (Space Grotesk 600) */}
                    <h4 className="text-sm font-display font-semibold text-[#F5F7F2]">
                      {review.clientName}
                    </h4>
                    {/* Role / Company (Inter 400) */}
                    <p className="text-xs font-sans font-normal text-[#9CA3AF]">
                      {review.clientRole} •{" "}
                      <span className="text-[#A3E635] font-medium">{review.clientCompany}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
