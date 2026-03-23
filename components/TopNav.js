"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const LINKS = [
  { href: "/",      label: "Home"       },
  { href: "/hw1",   label: "Homework 1" },
  { href: "/week4", label: "Week 4"     },
];

export default function TopNav() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-3 border-b border-black/[0.08] dark:border-white/10 backdrop-blur-xl bg-white/90 dark:bg-zinc-950/80">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="h-6 w-6 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold group-hover:bg-emerald-500/30 transition-colors">
          M
        </div>
        <span className="text-sm font-semibold text-slate-800 dark:text-white/80 group-hover:text-slate-900 dark:group-hover:text-white transition-colors tracking-tight">
          MAT 306
        </span>
      </Link>

      <div className="flex items-center gap-2">
        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color:      isActive ? "#10b981" : undefined,
                  background: isActive ? "rgba(16,185,129,0.1)" : "transparent",
                }}
              >
                <span className={isActive ? "" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}>
                  {label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="ml-2 p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
}
