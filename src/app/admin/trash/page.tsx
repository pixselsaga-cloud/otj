"use client";

import React, { useState, useEffect } from "react";
import { Trash2, RefreshCw, AlertTriangle, FolderOpen, Layers, Files, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

export default function AdminTrashPage() {
  const toast = useToast();
  const [trashData, setTrashData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Confirm Actions
  const [purgeTarget, setPurgeTarget] = useState<{ entity: string; id: string; name: string } | null>(null);
  const [isEmptyingAll, setIsEmptyingAll] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchTrash = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/trash");
      const data = await res.json();
      setTrashData(data);
    } catch {
      toast.error("Savatni yuklashda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (entity: string, id: string) => {
    try {
      const res = await fetch("/api/trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESTORE", entity, id }),
      });
      if (!res.ok) throw new Error("Qaytarishda xatolik");
      toast.success("Element muvaffaqiyatli qayta tiklandi!");
      fetchTrash();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handlePurge = async () => {
    if (!purgeTarget) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "PURGE", entity: purgeTarget.entity, id: purgeTarget.id }),
      });
      if (!res.ok) throw new Error("O'chirishda xatolik");
      toast.success("Element butunlay o'chirildi!");
      setPurgeTarget(null);
      fetchTrash();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmptyAll = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "EMPTY_ALL" }),
      });
      if (!res.ok) throw new Error("Savatni tozalashda xatolik");
      toast.success("Savat butunlay tozalandi!");
      setIsEmptyingAll(false);
      fetchTrash();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const totalCount = trashData?.total || 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F5F7F2]">
            Central Trash System
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            O'chirilgan loyihalar, fayllar, xizmatlar va xabarlarni tiklash yoki butunlay o'chirish
          </p>
        </div>

        {totalCount > 0 && (
          <Button size="sm" variant="danger" onClick={() => setIsEmptyingAll(true)}>
            <Trash2 className="w-3.5 h-3.5" />
            <span>Savatni butunlay tozalash ({totalCount})</span>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs font-mono text-[#6B7280]">
          Yuklanmoqda...
        </div>
      ) : totalCount === 0 ? (
        <div className="p-16 rounded-3xl glass-panel border border-dashed border-white/10 text-center space-y-3 bg-[#080A0B]/60">
          <Trash2 className="w-10 h-10 text-[#A3E635] mx-auto opacity-40" />
          <h3 className="text-base font-bold text-[#F5F7F2]">Savat bo'sh</h3>
          <p className="text-xs text-[#9CA3AF]">
            O'chirilgan hech qanday loyiha yoki fayl mavjud emas.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Projects Trash */}
          {trashData.items.projects.length > 0 && (
            <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-4">
              <h3 className="text-sm font-bold font-display text-[#F5F7F2]">
                O'chirilgan Loyihalar ({trashData.items.projects.length})
              </h3>
              <div className="space-y-2">
                {trashData.items.projects.map((p: any) => (
                  <div key={p.id} className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#F5F7F2]">{p.titleUz}</span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="glass" onClick={() => handleRestore("project", p.id)} className="text-xs">
                        <RefreshCw className="w-3 h-3" />
                        <span>Tiklash</span>
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setPurgeTarget({ entity: "project", id: p.id, name: p.titleUz })} className="text-xs">
                        <span>O'chirish</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files Trash */}
          {trashData.items.files.length > 0 && (
            <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-4">
              <h3 className="text-sm font-bold font-display text-[#F5F7F2]">
                O'chirilgan Fayllar ({trashData.items.files.length})
              </h3>
              <div className="space-y-2">
                {trashData.items.files.map((f: any) => (
                  <div key={f.id} className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#F5F7F2] truncate max-w-xs">{f.originalName}</span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="glass" onClick={() => handleRestore("file", f.id)} className="text-xs">
                        <RefreshCw className="w-3 h-3" />
                        <span>Tiklash</span>
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setPurgeTarget({ entity: "file", id: f.id, name: f.originalName })} className="text-xs">
                        <span>O'chirish</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages & Briefs Trash */}
          {trashData.items.messages.length > 0 && (
            <div className="p-6 rounded-3xl glass-panel border border-white/10 bg-[#080A0B]/80 space-y-4">
              <h3 className="text-sm font-bold font-display text-[#F5F7F2]">
                O'chirilgan Xabarlar ({trashData.items.messages.length})
              </h3>
              <div className="space-y-2">
                {trashData.items.messages.map((m: any) => (
                  <div key={m.id} className="p-3.5 rounded-2xl bg-white/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#F5F7F2]">{m.name}: {m.message?.slice(0, 30)}...</span>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="glass" onClick={() => handleRestore("message", m.id)} className="text-xs">
                        <RefreshCw className="w-3 h-3" />
                        <span>Tiklash</span>
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setPurgeTarget({ entity: "message", id: m.id, name: m.name })} className="text-xs">
                        <span>O'chirish</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Single Delete */}
      <ConfirmDialog
        isOpen={Boolean(purgeTarget)}
        onClose={() => setPurgeTarget(null)}
        onConfirm={handlePurge}
        title="Butunlay o'chirish"
        description={`"${purgeTarget?.name}" elementini bazadan va diskdan butunlay o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.`}
        isLoading={isProcessing}
      />

      {/* Confirmation Empty All */}
      <ConfirmDialog
        isOpen={isEmptyingAll}
        onClose={() => setIsEmptyingAll(false)}
        onConfirm={handleEmptyAll}
        title="Savatni tozalash"
        description="Savatdagi barcha o'chirilgan elementlar butunlay yo'q qilinadi. Rozimisiz?"
        isLoading={isProcessing}
      />
    </div>
  );
}
