"use client";

import { useState, useEffect, useMemo } from "react";

import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { NAVIGATION_ITEMS } from "@/lib/navigation";
import { CompanySelectorHeader } from "@/components/CompanySelectorHeader";

export function AppSidebar() {
  const [mounted, setMounted] = useState(false);
  const { state } = useSidebar();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    setMounted(true);
  }, []);

  const items = NAVIGATION_ITEMS;

  const shouldShowText = useMemo(() => {
    return mounted && (state === "expanded" || isMobile);
  }, [mounted, state, isMobile]);

  const handleNavigation = (e: React.MouseEvent, url: string, title: string) => {
    // Si es la ruta actual, no hacer nada
    if (pathname === url) {
      return;
    }

    void e;
    void title;
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent className="pt-2 md:pt-0">
        <SidebarGroup>
          {mounted && (
            <div className="px-2 py-1 mb-1 flex items-center justify-center">
              {state === "collapsed" && !isMobile ? (
                <CompanySelectorHeader
                  compact
                  align="start"
                  className="mx-auto"
                />
              ) : (
                <CompanySelectorHeader
                  compact={false}
                  align="start"
                  className="w-full justify-center"
                />
              )}
            </div>
          )}
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title} className="my-0.5">
                    {isActive ? (
                      <SidebarMenuButton isActive className="py-5">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-5 h-5 shrink-0" />
                          {shouldShowText && (
                            <span className="text-base">{item.title}</span>
                          )}
                        </div>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton asChild className="py-5">
                        <Link
                          href={item.url}
                          className="flex items-center gap-2"
                          onClick={(e) => handleNavigation(e, item.url, item.title)}
                        >
                          <item.icon className="w-5 h-5 shrink-0" />
                          {shouldShowText && (
                            <span className="text-base">{item.title}</span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  );
}
