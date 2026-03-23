"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/",      label: "Home"       },
  { href: "/hw1",   label: "Homework 1" },
  { href: "/week4", label: "Week 4"     },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-3 border-b border-white/10 backdrop-blur-xl bg-black/60">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="h-6 w-6 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold group-hover:bg-emerald-500/30 transition-colors">
          M
        </div>
        <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors tracking-tight">
          MAT 306
        </span>
      </Link>

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
                color:      isActive ? "#10b981" : "rgba(148,163,184,0.9)",
                background: isActive ? "rgba(16,185,129,0.1)" : "transparent",
              }}
            >
              {label}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
