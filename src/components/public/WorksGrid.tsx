"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Heart, ArrowUpRight, Share2, Send, Instagram, Copy, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface WorksGridProps {
  projects: any[];
  categories?: string[];
  showFilter?: boolean;
  limit?: number;
}

export function WorksGrid({
  projects,
  categories = [
    "ALL",
    "3D CGI & Motion",
    "Interior Design",
    "Photo Manipulation",
    "Brand Identity",
    "UI/UX Design",
    "Architecture & 3D Render",
  ],
  showFilter = true,
  limit,
}: WorksGridProps) {
  const toast = useToast();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [likedList, setLikedList] = useState<string[]>([]);
  const [shareModal, setShareModal] = useState<{ open: boolean; slug: string; title: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const rawFiltered =
    activeCategory === "ALL"
      ? projects
      : projects.filter(
          (p) =>
            p.category?.toLowerCase() === activeCategory.toLowerCase() ||
            p.subcategory?.toLowerCase() === activeCategory.toLowerCase()
        );

  const filteredProjects = limit ? rawFiltered.slice(0, limit) : rawFiltered;

  const handleLike = async (e: React.MouseEvent, id: string, slug: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (likedList.includes(id)) {
      toast.info("Siz bu loyihaga allaqachon like bosgansiz!");
      return;
    }

    try {
      const res = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "PROJECT_LIKE",
          targetType: "PROJECT",
          targetId: id,
          path: `/works/${slug}`,
          metadata: { slug },
        }),
      });

      if (res.ok) {
        setLikedList([...likedList, id]);
        toast.success("Rahmat!", "Loyiha yoqtirishlar ro'yxatiga qo'shildi");
      }
    } catch {}
  };

  const openShare = (e: React.MouseEvent, slug: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShareModal({ open: true, slug, title });
    setCopied(false);

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventType: "SHARE",
        targetType: "PROJECT",
        path: `/works/${slug}`,
        metadata: { slug, title },
      }),
    }).catch(() => {});
  };

  const copyShareLink = () => {
    if (!shareModal) return;
    const url = `${window.location.origin}/works/${shareModal.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Havola nusxalandi!", url);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-10">
      {/* Category Pills (Inter 500) */}
      {showFilter && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => {
            const isCurrent = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-4 py-2 rounded-full text-xs font-sans font-medium tracking-wide transition duration-300 ${
                  isCurrent
                    ? "bg-[#A3E635] text-[#050607] font-semibold shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                    : "bg-white/5 text-[#9CA3AF] hover:text-[#F5F7F2] hover:bg-white/10 border border-white/5"
                }`}
              >
                {cat === "ALL" ? "Barcha ishlar" : cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-16 text-center rounded-3xl glass-panel border border-dashed border-white/10 space-y-2 font-sans">
          <p className="text-sm font-medium text-[#F5F7F2]">Ushbu kategoriyada loyihalar mavjud emas</p>
          <p className="text-xs text-[#9CA3AF]">Tez orada yangi ishlar yuklanadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const isLiked = likedList.includes(project.id);

              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-[#A3E635]/40 transition-all duration-500 bg-[#080A0B]/80 flex flex-col justify-between"
                >
                  {/* Image Container */}
                  <Link href={`/works/${project.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-[#050607]">
                    <img
                      src={project.coverImage}
                      alt={project.titleUz}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080A0B] via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Category Badge (Inter 500-600) */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-sans font-medium tracking-wide bg-[#050607]/85 backdrop-blur-md text-[#A3E635] border border-white/10">
                        {project.category}
                      </span>
                    </div>

                    {/* Top Right Quick Actions (Share & Like) */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => openShare(e, project.slug, project.titleUz)}
                        className="p-2 rounded-xl bg-[#050607]/80 backdrop-blur-md text-[#F5F7F2] hover:text-[#A3E635] border border-white/10 transition"
                        title="Telegram / Instagram orqali ulashish"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleLike(e, project.id, project.slug)}
                        className={`p-2 rounded-xl bg-[#050607]/80 backdrop-blur-md border border-white/10 transition ${
                          isLiked ? "text-rose-500" : "text-[#F5F7F2] hover:text-rose-400"
                        }`}
                        title="Yoqtirish"
                      >
                        <Heart className="w-3.5 h-3.5" fill={isLiked ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </Link>

                  {/* Info Content */}
                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between font-sans">
                    <div>
                      {/* Metadata: sana, mijoz (Inter 400) */}
                      <div className="flex items-center justify-between text-[11px] font-sans text-[#6B7280] mb-1">
                        <span>{project.client || "Shaxsiy"}</span>
                        <span>{project.year || "2026"}</span>
                      </div>

                      {/* Project Title (Space Grotesk 500-600) */}
                      <Link href={`/works/${project.slug}`}>
                        <h3 className="text-lg sm:text-xl font-display font-semibold text-[#F5F7F2] group-hover:text-[#A3E635] transition duration-300 line-clamp-1">
                          {project.titleUz}
                        </h3>
                      </Link>

                      {/* Project Description (Inter 400) */}
                      <p className="text-xs font-sans font-normal text-[#9CA3AF] mt-1.5 line-clamp-2 leading-relaxed">
                        {project.descUz}
                      </p>
                    </div>

                    {/* Footer Metrics & Actions (Like count hidden as requested) */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs font-sans text-[#6B7280]">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> {project.views}
                        </span>
                        {/* Interactive heart indicator (count hidden) */}
                        <button
                          onClick={(e) => handleLike(e, project.id, project.slug)}
                          className={`flex items-center transition ${isLiked ? "text-rose-500 scale-110" : "hover:text-rose-400 text-[#6B7280]"}`}
                          title="Loyiha sizga yoqdimi?"
                        >
                          <Heart className="w-3.5 h-3.5" fill={isLiked ? "currentColor" : "none"} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => openShare(e, project.slug, project.titleUz)}
                          className="text-xs font-sans font-medium text-[#9CA3AF] hover:text-[#A3E635] transition flex items-center gap-1"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Ulashish</span>
                        </button>

                        <Link
                          href={`/works/${project.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-sans font-medium text-[#F5F7F2] group-hover:text-[#A3E635] transition"
                        >
                          <span>Ko'rish</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Share Modal (Telegram, Instagram, Copy Link) */}
      <AnimatePresence>
        {shareModal && shareModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-6 rounded-3xl glass-panel border border-white/15 bg-[#0D1112] shadow-2xl space-y-6 font-sans"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-display font-semibold text-[#F5F7F2]">
                    Loyihani ulashish
                  </h3>
                  <p className="text-xs text-[#9CA3AF] mt-0.5 line-clamp-1">
                    {shareModal.title}
                  </p>
                </div>
                <button
                  onClick={() => setShareModal(null)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#9CA3AF] transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Share Actions */}
              <div className="space-y-3">
                {/* Telegram Share */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== "undefined" ? `${window.location.origin}/works/${shareModal.slug}` : "")}&text=${encodeURIComponent(`Otajon Jahongirov portfolio loyihasi: ${shareModal.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-[#A3E635]/15 border border-white/10 hover:border-[#A3E635]/40 flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0088cc]/20 text-[#0088cc] group-hover:bg-[#A3E635]/20 group-hover:text-[#A3E635] flex items-center justify-center transition">
                      <Send className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-[#F5F7F2]">Telegram orqali ulashish</p>
                      <p className="text-[11px] text-[#9CA3AF]">Do'stlaringiz yoki guruhlarga jo'nating</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#A3E635] transition" />
                </a>

                {/* Instagram Share */}
                <button
                  onClick={() => {
                    copyShareLink();
                    window.open("https://instagram.com", "_blank");
                  }}
                  className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-pink-500/15 border border-white/10 hover:border-pink-500/40 flex items-center justify-between transition group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center transition">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#F5F7F2]">Instagram Stories / Direct</p>
                      <p className="text-[11px] text-[#9CA3AF]">Havola nusxalanadi va Instagram ochiladi</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-pink-400 transition" />
                </button>

                {/* Copy Link */}
                <button
                  onClick={copyShareLink}
                  className="w-full p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-[#F5F7F2] flex items-center justify-center transition">
                      {copied ? <Check className="w-5 h-5 text-[#A3E635]" /> : <Copy className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#F5F7F2]">
                        {copied ? "Havola nusxalandi!" : "Havolani nusxalash"}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF]">To'g'ridan-to'g'ri havolani oling</p>
                    </div>
                  </div>
                  {copied ? (
                    <Check className="w-4 h-4 text-[#A3E635]" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#9CA3AF]" />
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
