"use client";

import { useEffect, useRef, useState } from "react";

const SECTIONS = [
  { id: "section-intro", label: "Aim & Intro", short: "1" },
  { id: "section-methods", label: "Methods", short: "2" },
  { id: "section-results", label: "Results", short: "3" },
  { id: "section-boltzmann", label: "Boltzmann", short: "β" },
  { id: "section-explorer", label: "Explorer", short: "↗" },
  { id: "section-conclusions", label: "Conclusions", short: "4" },
];

export default function PageTOC() {
  const [activeId, setActiveId] = useState(null);
  const [visible, setVisible] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    // Show TOC after a small scroll
    const onScroll = () => setVisible(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Pick the topmost (first) visible section
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Sort by top position — closest to the top of viewport wins
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: 0 }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 transition-all duration-500"
      style={{ opacity: visible ? 1 : 0, pointerEvents: visible ? "auto" : "none" }}
      aria-label="Page navigation"
    >
      {SECTIONS.map(({ id, label, short }) => {
        const isActive = activeId === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            title={label}
            className="group relative flex items-center gap-2"
          >
            {/* Dot */}
            <div
              className="w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 flex-shrink-0"
              style={{
                borderColor: isActive ? "#10b981" : "rgba(100,116,139,0.5)",
                background: isActive ? "#10b981" : "transparent",
                boxShadow: isActive ? "0 0 8px #10b98180" : "none",
                transform: isActive ? "scale(1.3)" : "scale(1)",
              }}
            />
            {/* Tooltip label — appears on hover */}
            <span
              className="absolute left-5 whitespace-nowrap text-xs px-2 py-1 rounded-lg bg-black/80 backdrop-blur text-white border border-white/10 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              style={{ color: isActive ? "#10b981" : "#94a3b8" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
