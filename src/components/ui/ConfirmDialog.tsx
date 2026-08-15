"use client";

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Tasdiqlash",
  cancelText = "Bekor qilish",
  variant = "danger",
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
          variant === "danger" ? "bg-rose-500/20 text-rose-400" : "bg-[#A3E635]/20 text-[#A3E635]"
        }`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold text-[#F5F7F2] mb-2">{title}</h4>
        <p className="text-sm text-[#9CA3AF] mb-6 leading-relaxed">{description}</p>
        <div className="flex items-center gap-3 w-full">
          <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
