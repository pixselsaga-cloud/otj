"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Edit, Copy, Trash2, CheckCircle2, Archive, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function AdminProjectsPage() {
  const toast = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  // Confirm delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const url = `/api/projects?search=${encodeURIComponent(search)}&category=${category}&status=${status}`;
      const res = await fetch(url);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      toast.error("Loyihalarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [category, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}/duplicate`, { method: "POST" });
      if (!res.ok) throw new Error("Nusxalashda xatolik");
      toast.success("Loyiha muvaffaqiyatli nusxalandi!");
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Statusni o'zgartirishda xatolik");
      toast.success(`Loyiha holati "${nextStatus}" ga o'zgartirildi`);
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("O'chirishda xatolik");
      toast.success("Loyiha savatga yuborildi");
      setDeleteId(null);
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F5F7F2]">
            Projects CMS
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Barcha portfoliodagi loyihalarni boshqarish, tahrirlash va yangi loyihalar qo'shish
          </p>
        </div>

        <Link href="/admin/projects/new">
          <Button size="sm" variant="primary">
            <Plus className="w-4 h-4" />
            <span>Yangi loyiha qo'shish</span>
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Loyiha nomi yoki mijoz bo'yicha qidiruv..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F5F7F2] focus:outline-none focus:border-[#A3E635]"
          />
        </form>

        <div className="flex items-center gap-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 px-3 rounded-xl bg-[#080A0B] border border-white/10 text-xs text-[#F5F7F2] focus:outline-none focus:border-[#A3E635]"
          >
            <option value="ALL">Barcha kategoriyalar</option>
            <option value="3D CGI & Motion">3D CGI & Motion</option>
            <option value="Branding">Branding</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Posters">Posters</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 px-3 rounded-xl bg-[#080A0B] border border-white/10 text-xs text-[#F5F7F2] focus:outline-none focus:border-[#A3E635]"
          >
            <option value="ALL">Barcha holatlar</option>
            <option value="PUBLISHED">Chop etilgan (Published)</option>
            <option value="DRAFT">Qoralama (Draft)</option>
            <option value="ARCHIVED">Arxivlangan</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden bg-[#080A0B]/80">
        {isLoading ? (
          <div className="p-12 text-center text-xs font-mono text-[#6B7280]">
            Yuklanmoqda...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#9CA3AF]">
            Loyihalar topilmadi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/[0.02] text-[#6B7280] uppercase font-mono">
                <tr>
                  <th className="py-3.5 px-6">Muqova & Nomi</th>
                  <th className="py-3.5 px-4">Kategoriya</th>
                  <th className="py-3.5 px-4">Holat</th>
                  <th className="py-3.5 px-4">Ko'rishlar</th>
                  <th className="py-3.5 px-4">Likes</th>
                  <th className="py-3.5 px-4">Yil</th>
                  <th className="py-3.5 px-6 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.coverImage}
                          alt={p.titleUz}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-sm text-[#F5F7F2] line-clamp-1">
                            {p.titleUz}
                          </p>
                          <p className="text-[11px] text-[#6B7280] font-mono">
                            /{p.slug} • {p.client || "Self"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-[#9CA3AF] font-medium">
                      {p.category}
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(p.id, p.status)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase transition ${
                          p.status === "PUBLISHED"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {p.status}
                      </button>
                    </td>

                    <td className="py-4 px-4 font-mono text-[#F5F7F2]">
                      {p.views}
                    </td>

                    <td className="py-4 px-4 font-mono text-[#A3E635]">
                      {p.likes}
                    </td>

                    <td className="py-4 px-4 font-mono text-[#6B7280]">
                      {p.year}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/works/${p.slug}`} target="_blank">
                          <Button size="icon" variant="ghost" className="h-8 w-8" title="Saytda ko'rish">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Link href={`/admin/projects/${p.id}`}>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-[#A3E635]" title="Tahrirlash">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleDuplicate(p.id)}
                          title="Nusxalash (Duplicate)"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-rose-400 hover:text-rose-300"
                          onClick={() => setDeleteId(p.id)}
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Loyihani savatga yuborish"
        description="Haqiqatan ham ushbu loyihani savatga o'tkazmoqchimisiz? Uni keyinchalik Savat (Trash) bo'limidan qayta tiklashingiz mumkin."
        isLoading={isDeleting}
      />
    </div>
  );
}
