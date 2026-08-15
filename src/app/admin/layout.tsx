"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    // If on login page, skip check
    if (pathname === "/admin/login") {
      setIsChecking(false);
      return;
    }

    // Verify session
    fetch("/api/auth/me")
      .then((res) => {
        if (!res.ok) {
          router.push("/admin/login");
        } else {
          setIsChecking(false);
        }
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#050607] text-[#F5F7F2] font-sans">{children}</div>;
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#050607] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#A3E635] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050607] text-[#F5F7F2] flex font-sans">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        } ml-0 w-full overflow-x-hidden`}
      >
        <AdminHeader onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1 bg-[#050607] overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}
