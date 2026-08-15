"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Search, ExternalLink, Menu } from "lucide-react";

interface AdminHeaderProps {
  onToggleMobileMenu?: () => void;
}

export function AdminHeader({ onToggleMobileMenu }: AdminHeaderProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initial fetch of notifications
    setNotifications([
      { id: "1", title: "Yangi brief qabul qilindi", time: "5 daqiqa oldin" },
      { id: "2", title: "Lumina loyihasi ko'rildi", time: "1 soat oldin" },
    ]);
    setUnreadCount(2);
  }, []);

  return (
    <header className="h-16 border-b border-white/10 bg-[#080A0B]/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-sans">
      <div className="flex items-center gap-3 max-w-md w-full">
        {/* Mobile menu toggle button */}
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl glass-panel border border-white/10 text-[#F5F7F2] hover:bg-white/5 transition"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Qidiruv: loyihalar, mijozlar, fayllar..."
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-white/5 border border-white/10 text-xs text-[#F5F7F2] placeholder:text-[#6B7280] focus:outline-none focus:border-[#A3E635]"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Public Website Preview Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-panel text-xs text-[#F5F7F2] hover:border-[#A3E635]/40 transition border border-white/10"
        >
          <span>Jonli sayt</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#A3E635]" />
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl glass-panel border border-white/10 text-[#9CA3AF] hover:text-[#F5F7F2] relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#A3E635] shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl glass-panel bg-[#0D1112]/95 border border-white/10 shadow-2xl z-50 p-4 space-y-3 backdrop-blur-xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-xs font-semibold font-display text-[#F5F7F2]">XABARNOMALAR</span>
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-[10px] text-[#A3E635] hover:underline"
                  >
                    O'qildi deb belgilash
                  </button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                      <p className="font-medium text-[#F5F7F2]">{n.title}</p>
                      <p className="text-[10px] text-[#6B7280]">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 pl-2 sm:pl-3 border-l border-white/10">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#A3E635]/20 border border-[#A3E635]/40 flex items-center justify-center font-bold text-[11px] sm:text-xs text-[#A3E635]">
            OJ
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-semibold text-[#F5F7F2]">Otajon Jahongirov</span>
            <span className="text-[9px] font-mono text-[#A3E635]">SUPER ADMIN</span>
          </div>
        </div>
      </div>
    </header>
  );
}
