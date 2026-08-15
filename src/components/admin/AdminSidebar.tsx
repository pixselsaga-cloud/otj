"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  FolderKanban,
  Sparkles,
  Files,
  Users,
  MessageSquare,
  FileCheck,
  User,
  Share2,
  TrendingUp,
  Settings,
  Trash2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Workflow,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface AdminSidebarProps {
  collapsed?: boolean;
  setCollapsed?: (val: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (val: boolean) => void;
}

export function AdminSidebar({
  collapsed = false,
  setCollapsed,
  mobileOpen = false,
  setMobileOpen,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/projects", label: "Projects CMS", icon: FolderKanban },
    { href: "/admin/services", label: "Services CMS", icon: Sparkles },
    { href: "/admin/files", label: "File Manager", icon: Files },
    { href: "/admin/clients", label: "Client Rooms", icon: Users },
    { href: "/admin/briefs", label: "AI Briefs", icon: FileCheck },
    { href: "/admin/messages", label: "Inbox Messages", icon: MessageSquare },
    { href: "/admin/about", label: "About & Skills", icon: User },
    { href: "/admin/socials", label: "Social Networks", icon: Share2 },
    { href: "/admin/stats", label: "Live Statistics", icon: TrendingUp },
    { href: "/admin/process", label: "Workflow Process", icon: Workflow },
    { href: "/admin/settings", label: "Settings & SEO", icon: Settings },
    { href: "/admin/trash", label: "Trash System", icon: Trash2 },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.info("Tizimdan chiqildi");
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  const handleLinkClick = () => {
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen && setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 bg-[#080A0B] border-r border-white/10 flex flex-col justify-between transition-all duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-20" : "w-64"}`}
      >
        {/* Brand Header */}
        <div>
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={handleLinkClick}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#A3E635]/15 border border-[#A3E635]/30 flex items-center justify-center font-display font-black text-[#A3E635] shrink-0">
                OJ
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="flex flex-col truncate">
                  <span className="text-xs sm:text-sm font-bold text-[#F5F7F2] font-display uppercase tracking-wider truncate">
                    OTJ STUDIO
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-[#A3E635] tracking-widest uppercase">
                    MANAGEMENT CMS
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Collapse button */}
            {setCollapsed && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex p-1.5 rounded-lg text-[#6B7280] hover:text-[#F5F7F2] hover:bg-white/5 transition"
                aria-label="Collapse Sidebar"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            )}

            {/* Mobile Close button */}
            {setMobileOpen && (
              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#F5F7F2] hover:bg-white/5 transition"
                aria-label="Close Mobile Sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation links */}
          <div className="py-3 px-2 sm:px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] font-sans">
            {menuItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#A3E635] text-[#050607] font-semibold shadow-[0_0_15px_rgba(163,230,53,0.25)]"
                      : "text-[#9CA3AF] hover:text-[#F5F7F2] hover:bg-white/5"
                  }`}
                  title={collapsed && !mobileOpen ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {(!collapsed || mobileOpen) && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-3 border-t border-white/10 space-y-1 font-sans">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-[#9CA3AF] hover:text-[#A3E635] hover:bg-white/5 transition"
            title="Veb-saytni ko'rish"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {(!collapsed || mobileOpen) && <span>Veb-saytni ko'rish</span>}
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition"
            title="Chiqish"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!collapsed || mobileOpen) && <span>Chiqish (Logout)</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
