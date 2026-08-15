"use client";

import React, { useState, useEffect } from "react";
import {
  UploadCloud,
  Search,
  Grid,
  List,
  FolderOpen,
  FileText,
  Image as ImageIcon,
  Film,
  Download,
  Trash2,
  Archive,
  RefreshCw,
  Eye,
  Edit2,
  CheckSquare,
  Square,
  Layers,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { FileUploader } from "@/components/ui/FileUploader";
import { useToast } from "@/components/ui/Toast";
import { formatBytes, formatDateTime } from "@/lib/utils";

export default function AdminFileManagerPage() {
  const toast = useToast();
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [status, setStatus] = useState("READY");

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Preview & Edit Modal
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [editingFile, setEditingFile] = useState<any>(null);
  const [renameInput, setRenameInput] = useState("");

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/files?search=${encodeURIComponent(search)}&category=${category}&status=${status}`);
      const data = await res.json();
      setFiles(data.files || []);
      setSelectedIds([]);
    } catch {
      toast.error("Fayllarni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [category, status]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    if (selectedIds.length === files.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(files.map((f) => f.id));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch("/api/files/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: selectedIds }),
      });
      if (!res.ok) throw new Error("Amal bajarilmadi");
      toast.success(`${selectedIds.length} ta fayl ustida amal bajarildi`);
      fetchFiles();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFile || !renameInput.trim()) return;

    try {
      const res = await fetch(`/api/files/${editingFile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalName: renameInput.trim() }),
      });

      if (!res.ok) throw new Error("Fayl nomi o'zgartirilmadi");
      toast.success("Fayl nomi muvaffaqiyatli o'zgartirildi!");
      setEditingFile(null);
      fetchFiles();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteSingle = async (id: string) => {
    try {
      const res = await fetch(`/api/files/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("O'chirishda xatolik");
      toast.success("Fayl savatga yuborildi");
      fetchFiles();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F5F7F2]">
            File & Asset Manager
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Barcha 3D modellar, renderlar, video va grafik aktivlarni boshqarish
          </p>
        </div>

        {/* Upload Drawer Trigger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition ${viewMode === "grid" ? "bg-[#A3E635] text-[#050607]" : "text-[#9CA3AF]"}`}
              title="Grid ko'rinishi"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition ${viewMode === "list" ? "bg-[#A3E635] text-[#050607]" : "text-[#9CA3AF]"}`}
              title="Ro'yxat ko'rinishi"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Upload Zone */}
      <FileUploader
        onUploadSuccess={() => fetchFiles()}
        multiple={true}
        category="General Asset"
      />

      {/* Filter & Bulk Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#080A0B]/80">
        <div className="flex items-center gap-3 flex-1 min-w-[260px]">
          <button
            onClick={selectAll}
            className="flex items-center gap-2 text-xs font-semibold text-[#9CA3AF] hover:text-[#F5F7F2]"
          >
            {selectedIds.length > 0 && selectedIds.length === files.length ? (
              <CheckSquare className="w-4 h-4 text-[#A3E635]" />
            ) : (
              <Square className="w-4 h-4" />
            )}
            <span>Barchasini tanlash ({selectedIds.length})</span>
          </button>

          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Fayl nomi bo'yicha..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-white/5 border border-white/10 text-xs text-[#F5F7F2]"
            />
          </div>
        </div>

        {/* Bulk Action Buttons if selected */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="glass" onClick={() => handleBulkAction("ARCHIVE")}>
              <Archive className="w-3.5 h-3.5" />
              <span>Arxivlash</span>
            </Button>
            <Button size="sm" variant="danger" onClick={() => handleBulkAction("TRASH")}>
              <Trash2 className="w-3.5 h-3.5" />
              <span>Savatga yuborish</span>
            </Button>
          </div>
        )}
      </div>

      {/* Grid or List View */}
      {isLoading ? (
        <div className="p-12 text-center text-xs font-mono text-[#6B7280]">
          Yuklanmoqda...
        </div>
      ) : files.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#9CA3AF]">
          Fayllar topilmadi.
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file) => {
            const isImg = file.mimeType.startsWith("image/");
            const isSelected = selectedIds.includes(file.id);

            return (
              <div
                key={file.id}
                className={`group relative p-3 rounded-2xl glass-panel border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? "border-[#A3E635] bg-[#A3E635]/5 shadow-[0_0_15px_rgba(163,230,53,0.2)]"
                    : "border-white/10 hover:border-white/20 bg-[#080A0B]/80"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleSelect(file.id)}
                  className="absolute top-2 left-2 z-10 p-1.5 rounded-lg bg-[#050607]/80 text-[#F5F7F2]"
                >
                  {isSelected ? (
                    <CheckSquare className="w-4 h-4 text-[#A3E635]" />
                  ) : (
                    <Square className="w-4 h-4 text-[#9CA3AF]" />
                  )}
                </button>

                {/* Thumbnail */}
                <div
                  onClick={() => setPreviewFile(file)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-[#050607] cursor-pointer mb-3 flex items-center justify-center"
                >
                  {isImg ? (
                    <img
                      src={file.publicUrl}
                      alt={file.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <FileText className="w-12 h-12 text-[#A3E635]" />
                  )}
                </div>

                {/* Details */}
                <div>
                  <p className="text-xs font-bold text-[#F5F7F2] truncate" title={file.originalName}>
                    {file.originalName}
                  </p>
                  <p className="text-[10px] font-mono text-[#6B7280] mt-0.5">
                    {formatBytes(file.size)} • v{file.version}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/5">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingFile(file);
                        setRenameInput(file.originalName);
                      }}
                      className="p-1 rounded text-[#9CA3AF] hover:text-[#A3E635]"
                      title="Nomini o'zgartirish"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={file.publicUrl}
                      download={file.originalName}
                      className="p-1 rounded text-[#9CA3AF] hover:text-[#A3E635]"
                      title="Yuklab olish"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <button
                    onClick={() => handleDeleteSingle(file.id)}
                    className="p-1 rounded text-rose-400 hover:text-rose-300"
                    title="Savatga yuborish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden bg-[#080A0B]/80">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-white/[0.02] text-[#6B7280] font-mono">
              <tr>
                <th className="py-3 px-4">Nomi</th>
                <th className="py-3 px-4">Kategoriya</th>
                <th className="py-3 px-4">Hajmi</th>
                <th className="py-3 px-4">Versiya</th>
                <th className="py-3 px-4">Yuklangan sana</th>
                <th className="py-3 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <button onClick={() => toggleSelect(file.id)}>
                      {selectedIds.includes(file.id) ? (
                        <CheckSquare className="w-4 h-4 text-[#A3E635]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#6B7280]" />
                      )}
                    </button>
                    <span className="font-bold text-[#F5F7F2]">{file.originalName}</span>
                  </td>
                  <td className="py-3 px-4 text-[#9CA3AF]">{file.category}</td>
                  <td className="py-3 px-4 font-mono text-[#6B7280]">{formatBytes(file.size)}</td>
                  <td className="py-3 px-4 font-mono text-[#A3E635]">v{file.version}</td>
                  <td className="py-3 px-4 text-[#6B7280]">{formatDateTime(file.createdAt)}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <a href={file.publicUrl} target="_blank" className="text-[#9CA3AF] hover:text-[#A3E635]">
                      Ko'rish
                    </a>
                    <button onClick={() => handleDeleteSingle(file.id)} className="text-rose-400 hover:underline">
                      O'chirish
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={Boolean(previewFile)}
        onClose={() => setPreviewFile(null)}
        title={previewFile?.originalName}
        description={`Hajmi: ${formatBytes(previewFile?.size || 0)} • ${previewFile?.mimeType}`}
        maxWidth="2xl"
      >
        {previewFile?.mimeType?.startsWith("image/") ? (
          <div className="rounded-2xl overflow-hidden bg-[#050607] max-h-[500px] flex items-center justify-center">
            <img src={previewFile?.publicUrl} alt={previewFile?.originalName} className="max-h-[500px] object-contain" />
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-[#9CA3AF]">
            Ushbu fayl turini oldindan ko'rish imkoni yo'q.
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-4">
          <div className="text-xs font-mono text-[#6B7280]">
            URL: {previewFile?.publicUrl}
          </div>
          <a href={previewFile?.publicUrl} download={previewFile?.originalName}>
            <Button size="sm" variant="primary">
              <Download className="w-4 h-4" />
              <span>Yuklab olish</span>
            </Button>
          </a>
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={Boolean(editingFile)}
        onClose={() => setEditingFile(null)}
        title="Fayl nomini o'zgartirish"
      >
        <form onSubmit={handleRename} className="space-y-4">
          <Input
            label="Yangi Fayl Nomi"
            value={renameInput}
            onChange={(e) => setRenameInput(e.target.value)}
            required
            autoFocus
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setEditingFile(null)}>
              Bekor qilish
            </Button>
            <Button variant="primary" type="submit">
              Saqlash
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
