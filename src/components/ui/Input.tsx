"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, type = "text", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-[#9CA3AF] tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            ref={ref}
            className={cn(
              "w-full h-11 px-4 rounded-xl bg-[#080A0B]/80 border border-white/10 text-[#F5F7F2] placeholder:text-[#6B7280] text-sm transition-all focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] disabled:opacity-50 disabled:cursor-not-allowed",
              error && "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[#6B7280]">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-[#9CA3AF] tracking-wide uppercase">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-[#080A0B]/80 border border-white/10 text-[#F5F7F2] placeholder:text-[#6B7280] text-sm transition-all focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] disabled:opacity-50 disabled:cursor-not-allowed resize-y",
            error && "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-rose-400 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[#6B7280]">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, children, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold text-[#9CA3AF] tracking-wide uppercase">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "w-full h-11 px-4 rounded-xl bg-[#080A0B]/80 border border-white/10 text-[#F5F7F2] text-sm transition-all focus:outline-none focus:border-[#A3E635] focus:ring-1 focus:ring-[#A3E635] disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-rose-500/80 focus:border-rose-500 focus:ring-rose-500",
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#0D1112] text-[#F5F7F2]">
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "lime" | "default" | "outline" | "danger" | "success" | "warning";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variants = {
    lime: "bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30",
    default: "bg-white/10 text-[#F5F7F2] border border-white/10",
    outline: "border border-white/20 text-[#9CA3AF]",
    danger: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
