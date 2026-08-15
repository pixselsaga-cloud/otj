"use client";

import React, { useState } from "react";
import Link from "next/link";
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
          targetId: id,
          targetSlug: slug,
          path: `/works/${slug}`,
        }),
      });

      if (res.ok) {
        setLikedList((prev) => [...prev, id]);
        toast.success("Rahmat!", "Loyiha sizga ma'qul bo'lganidan xursandmiz.");
      }
    } catch {
      setLikedList((prev) => [...prev, id]);
      toast.success("Rahmat!", "Loyiha sizga ma'qul bo'lganidan xursandmiz.");
    }
  };

  const openShare = (e: React.MouseEvent, slug: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    setShareModal({ open: true, slug, title });
    setCopied(false);
  };

  const getShareUrl = (slug: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/works/${slug}`;
    }
    return `https://otj.studio/works/${slug}`;
  };

  const shareTelegram = (slug: string, title: string) => {
    const url = getShareUrl(slug);
    const text = encodeURIComponent(`Otajon Jahongirov portfolio loyihasi: "${title}"\n${url}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`, "_blank");
  };

  const shareInstagram = async (slug: string) => {
    const url = getShareUrl(slug);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Havola nusxalandi!", "Instagram profilingizda yoki Stories'da ulashishingiz mumkin.");
      window.open("https://instagram.com", "_blank");
    } catch {
      window.open("https://instagram.com", "_blank");
    }
  };

  const copyDirectLink = async (slug: string) => {
    const url = getShareUrl(slug);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Havola nusxalandi!", "Istalgan joyga yuborishingiz mumkin.");
    } catch {
      toast.info(`Havola: ${url}`);
    }
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Category Pills (Mobile horizontal scroll + Desktop wrap) */}
      {showFilter && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const isCurrent = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-sans font-medium tracking-wide transition duration-200 ${
                  isCurrent
                    ? "bg-[#A3E635] text-[#050607] font-semibold shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                    : "bg-white/[0.04] text-[#9CA3AF] hover:text-[#F5F7F2] hover:bg-white/10 border border-white/5"
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
        <div className="p-12 sm:p-16 text-center rounded-2xl sm:rounded-3xl glass-panel border border-dashed border-white/10 space-y-2 font-sans">
          <p className="text-sm font-medium text-[#F5F7F2]">Ushbu kategoriyada loyihalar mavjud emas</p>
          <p className="text-xs text-[#9CA3AF]">Tez orada yangi ishlar yuklanadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => {
            const isLiked = likedList.includes(project.id);

            return (
              <div
                key={project.id}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-[#A3E635]/40 transition-all duration-300 bg-[#080A0B]/90 flex flex-col justify-between"
              >
                {/* Image Container */}
                <Link href={`/works/${project.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-[#050607]">
                  <img
                    src={project.coverImage}
                    alt={project.titleUz}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080A0B] via-transparent to-transparent opacity-80 sm:opacity-75 sm:group-hover:opacity-60 transition-opacity" />

                  {/* Category Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-medium tracking-wide bg-[#050607]/85 backdrop-blur-md text-[#A3E635] border border-white/10">
                      {project.category}
                    </span>
                  </div>

                  {/* Top Right Quick Actions (Touch accessible on mobile) */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => openShare(e, project.slug, project.titleUz)}
                      className="p-2 rounded-xl bg-[#050607]/80 backdrop-blur-md text-[#F5F7F2] hover:text-[#A3E635] border border-white/10 active:scale-95 transition"
                      title="Telegram / Instagram orqali ulashish"
                      aria-label="Ulashish"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleLike(e, project.id, project.slug)}
                      className={`p-2 rounded-xl bg-[#050607]/80 backdrop-blur-md border border-white/10 active:scale-95 transition ${
                        isLiked ? "text-rose-500" : "text-[#F5F7F2] hover:text-rose-400"
                      }`}
                      title="Yoqtirish"
                      aria-label="Yoqtirish"
                    >
                      <Heart className="w-3.5 h-3.5" fill={isLiked ? "currentColor" : "none"} />
                    </button>
                  </div>
                </Link>

                {/* Info Content */}
                <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between font-sans">
                  <div>
                    {/* Metadata */}
                    <div className="flex items-center justify-between text-[11px] font-sans text-[#6B7280] mb-1">
                      <span>{project.client || "Shaxsiy"}</span>
                      <span>{project.year || "2026"}</span>
                    </div>

                    {/* Project Title */}
                    <Link href={`/works/${project.slug}`}>
                      <h3 className="text-base sm:text-lg font-display font-semibold text-[#F5F7F2] group-hover:text-[#A3E635] transition duration-200 line-clamp-1">
                        {project.titleUz}
                      </h3>
                    </Link>

                    {/* Project Description */}
                    <p className="text-xs font-sans font-normal text-[#9CA3AF] mt-1.5 line-clamp-2 leading-relaxed">
                      {project.descUz}
                    </p>
                  </div>

                  {/* Footer Metrics & Actions */}
                  <div className="pt-3.5 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs font-sans text-[#6B7280]">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {project.views}
                      </span>
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
              </div>
            );
          })}
        </div>
      )}

      {/* Share Modal Dialog */}
      {shareModal?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm p-6 rounded-3xl glass-panel border border-white/15 bg-[#0D1112] shadow-2xl space-y-5 font-sans">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-sm font-semibold text-[#F5F7F2] font-display">
                Loyihani ulashish
              </h4>
              <button
                onClick={() => setShareModal(null)}
                className="p-1 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#9CA3AF] leading-relaxed">
              <strong className="text-[#F5F7F2]">"{shareModal.title}"</strong> loyihasini do'stlaringiz yoki mijozlaringiz bilan ulashing:
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => shareTelegram(shareModal.slug, shareModal.title)}
                className="w-full py-3 px-4 rounded-xl bg-[#229ED9]/15 hover:bg-[#229ED9]/25 border border-[#229ED9]/30 flex items-center justify-center gap-2 text-xs font-semibold text-[#F5F7F2] transition"
              >
                <Send className="w-4 h-4 text-[#229ED9]" />
                <span>Telegram orqali yuborish</span>
              </button>

              <button
                onClick={() => shareInstagram(shareModal.slug)}
                className="w-full py-3 px-4 rounded-xl bg-[#E1306C]/15 hover:bg-[#E1306C]/25 border border-[#E1306C]/30 flex items-center justify-center gap-2 text-xs font-semibold text-[#F5F7F2] transition"
              >
                <Instagram className="w-4 h-4 text-[#E1306C]" />
                <span>Instagram (Havolani nusxalash)</span>
              </button>

              <button
                onClick={() => copyDirectLink(shareModal.slug)}
                className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold text-[#F5F7F2] transition"
              >
                {copied ? <Check className="w-4 h-4 text-[#A3E635]" /> : <Copy className="w-4 h-4 text-[#9CA3AF]" />}
                <span>{copied ? "Nusxalandi!" : "To'g'ridan-to'g'ri havola"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
