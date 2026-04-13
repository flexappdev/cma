import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings";
import { ProgressProvider } from "@/lib/progress";
import ShellWrapper from "@/components/ShellWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMA — Claude Managed Agents",
  description: "Learn Claude Managed Agents: core API, built-in tools, multi-agent patterns, security, and certification.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-[#0a0a0a] text-zinc-100`}>
        <SettingsProvider>
          <ProgressProvider>
            <ShellWrapper>
              {children}
            </ShellWrapper>
          </ProgressProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
