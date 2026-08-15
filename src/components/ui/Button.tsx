"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "glass";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050607] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none rounded-xl";

    const variants = {
      primary:
        "bg-[#A3E635] text-[#050607] font-semibold hover:bg-[#BEF264] shadow-[0_0_20px_rgba(163,230,53,0.25)] hover:shadow-[0_0_30px_rgba(163,230,53,0.4)]",
      secondary:
        "bg-white/10 text-[#F5F7F2] hover:bg-white/15 border border-white/10 hover:border-white/20",
      outline:
        "border border-white/15 text-[#F5F7F2] hover:border-[#A3E635] hover:text-[#A3E635] bg-transparent",
      danger:
        "bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30",
      ghost:
        "text-[#9CA3AF] hover:text-[#F5F7F2] hover:bg-white/5",
      glass:
        "glass-panel text-[#F5F7F2] hover:border-[#A3E635]/40 hover:bg-white/5",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs gap-1.5",
      md: "h-11 px-5 text-sm gap-2",
      lg: "h-13 px-7 text-base font-semibold gap-2.5",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
