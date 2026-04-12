"use client";
import { useSettings } from "@/lib/settings";
import LeftSidebar from "./LeftSidebar";
import AppFooter from "./AppFooter";

export default function ShellWrapper({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const sidebarWidth = settings.navCollapsed ? 52 : 180;
  return (
    <>
      <LeftSidebar />
      <main
        className="min-h-screen pb-12 transition-[margin] duration-200"
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        {children}
      </main>
      <AppFooter />
    </>
  );
}
