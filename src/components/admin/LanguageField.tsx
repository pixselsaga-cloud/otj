"use client";

import React, { useState } from "react";
import { Input, Textarea } from "@/components/ui/Input";

export interface LanguageFieldProps {
  label: string;
  isTextarea?: boolean;
  rows?: number;
  values: {
    uz: string;
    ru: string;
    en: string;
  };
  onChange: (lang: "uz" | "ru" | "en", value: string) => void;
  required?: boolean;
}

export function LanguageField({
  label,
  isTextarea = false,
  rows = 4,
  values,
  onChange,
  required = false,
}: LanguageFieldProps) {
  const [activeTab, setActiveTab] = useState<"uz" | "ru" | "en">("uz");

  return (
    <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
          {label} {required && <span className="text-[#A3E635]">*</span>}
        </label>
        <div className="flex items-center gap-1 bg-[#050607] p-1 rounded-lg border border-white/10">
          {(["uz", "ru", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setActiveTab(l)}
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase transition ${
                activeTab === l
                  ? "bg-[#A3E635] text-[#050607]"
                  : "text-[#6B7280] hover:text-[#F5F7F2]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {isTextarea ? (
        <Textarea
          rows={rows}
          value={values[activeTab]}
          onChange={(e) => onChange(activeTab, e.target.value)}
          placeholder={`(${activeTab.toUpperCase()}) ${label}...`}
        />
      ) : (
        <Input
          value={values[activeTab]}
          onChange={(e) => onChange(activeTab, e.target.value)}
          placeholder={`(${activeTab.toUpperCase()}) ${label}...`}
        />
      )}
    </div>
  );
}
