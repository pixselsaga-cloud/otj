"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, CheckCircle2, AlertCircle, Loader2, FileText, Image as ImageIcon } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { useToast } from "./Toast";

export interface UploadedFileData {
  id: string;
  originalName: string;
  publicUrl: string;
  size: number;
  mimeType: string;
}

export interface FileUploaderProps {
  onUploadSuccess?: (file: UploadedFileData) => void;
  multiple?: boolean;
  maxSizeMB?: number;
  accept?: string;
  category?: string;
  projectId?: string;
  clientId?: string;
  visibility?: "PRIVATE" | "CLIENT_VISIBLE" | "DOWNLOADABLE" | "VIEW_ONLY";
}

export function FileUploader({
  onUploadSuccess,
  multiple = false,
  maxSizeMB = 50,
  accept = "*/*",
  category = "Uncategorized",
  projectId,
  clientId,
  visibility = "CLIENT_VISIBLE",
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check max size
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`Fayl hajmi ${maxSizeMB}MB dan oshmasligi kerak: ${file.name}`);
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      formData.append("visibility", visibility);
      if (projectId) formData.append("projectId", projectId);
      if (clientId) formData.append("clientId", clientId);

      setIsUploading(true);
      setUploadProgress(30);

      try {
        const res = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        setUploadProgress(80);

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Fayl yuklashda xatolik yuz berdi");
        }

        const data = await res.json();
        setUploadProgress(100);
        toast.success(`"${file.name}" muvaffaqiyatli yuklandi!`);
        if (onUploadSuccess && data.file) {
          onUploadSuccess(data.file);
        }
      } catch (err: any) {
        toast.error(err.message || "Faylni yuklashda xatolik");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? "border-[#A3E635] bg-[#A3E635]/5 scale-[0.99]"
            : "border-white/10 hover:border-white/20 bg-white/[0.02]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#A3E635] mb-3 shadow-inner">
          {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
        </div>

        <p className="text-sm font-semibold text-[#F5F7F2]">
          {isUploading ? "Yuklanmoqda..." : "Fayllarni bu yerga tashlang yoki tanlang"}
        </p>
        <p className="text-xs text-[#6B7280] mt-1">
          JPG, PNG, WEBP, MP4, MOV, PDF, ZIP (Maksimal {maxSizeMB}MB)
        </p>

        {isUploading && (
          <div className="w-full max-w-xs mt-4 bg-white/10 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#A3E635] h-full transition-all duration-300 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
