"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, Loader2, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "loading";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastMessage, "id">) => string;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  loading: (title: string, description?: string) => string;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, description, duration = 4000 }: Omit<ToastMessage, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, description, duration }]);

      if (type !== "loading" && duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const success = useCallback((title: string, description?: string) => showToast({ type: "success", title, description }), [showToast]);
  const error = useCallback((title: string, description?: string) => showToast({ type: "error", title, description }), [showToast]);
  const info = useCallback((title: string, description?: string) => showToast({ type: "info", title, description }), [showToast]);
  const loading = useCallback((title: string, description?: string) => showToast({ type: "loading", title, description, duration: 0 }), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, success, error, info, loading }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl glass-panel border border-white/10 bg-[#0D1112]/95 shadow-2xl backdrop-blur-xl text-[#F5F7F2]"
            >
              <div className="mt-0.5 shrink-0">
                {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#A3E635]" />}
                {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-400" />}
                {toast.type === "info" && <Info className="w-5 h-5 text-sky-400" />}
                {toast.type === "loading" && <Loader2 className="w-5 h-5 text-[#A3E635] animate-spin" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#F5F7F2]">{toast.title}</p>
                {toast.description && <p className="text-xs text-[#9CA3AF] mt-0.5 leading-relaxed">{toast.description}</p>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#6B7280] hover:text-[#F5F7F2] transition p-1"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
