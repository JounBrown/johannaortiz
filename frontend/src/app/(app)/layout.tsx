"use client";

import { useState, useCallback, useEffect, type ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggleSimple } from "@/components/theme-toggle";

const COMPANY_COOKIE = "selectedCompany";
const COMPANY_STORAGE_KEY = "selectedCompany";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClearCompany = useCallback(() => {
    document.cookie = `${COMPANY_COOKIE}=; path=/; max-age=0; samesite=lax`;
    window.location.href = '/dashboard';
  }, []);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-[100] w-full shrink-0 border-b border-sidebar-border bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80">
          <div className="flex items-center justify-between h-14 px-2 md:px-4 relative min-w-0">
            <SidebarTrigger className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 border-0 shadow-none p-2 rounded-md transition-colors" />
            <div className="flex items-center gap-2">
              <ThemeToggleSimple />
            </div>
          </div>
        </header>

        <div className="flex flex-1 min-h-0">
          <AppSidebar />
          <main className="flex flex-1 flex-col w-full min-w-0">
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
