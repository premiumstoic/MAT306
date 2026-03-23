"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { CONFORMATIONS } from "./MolecularViewer";
import { useTheme } from "@/components/ThemeProvider";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// Full pathway for playback (7 frames)
const STEPS = [
  { name: "Chair", key: "chair", x: 0, y: 0.0 },
  { name: "Half-Chair", key: "half_chair", x: 1, y: 10.5 },
  { name: "Twist-Boat", key: "twist_boat", x: 2, y: 5.5 },
  { name: "Boat", key: "boat", x: 3, y: 7.5 },
  { name: "Twist-Boat", key: "twist_boat", x: 4, y: 5.5 },
  { name: "Half-Chair", key: "half_chair", x: 5, y: 10.5 },
  { name: "Chair", key: "chair", x: 6, y: 0.0 },
];

// Unique displayable states for buttons
const UNIQUE_STATES = [
  { name: "Chair", key: "chair", y: 0.0 },
  { name: "Half-Chair", key: "half_chair", y: 10.5 },
  { name: "Twist-Boat", key: "twist_boat", y: 5.5 },
  { name: "Boat", key: "boat", y: 7.5 },
];

const STATE_DESCRIPTORS = {
  chair:      "Global Minimum",
  half_chair: "Energy Barrier",
  twist_boat: "Local Minimum",
  boat:       "Saddle Point",
};

export default function ReactionCoordinateChart({ onSelect }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const xs = STEPS.map((s) => s.x);
  const ys = STEPS.map((s) => s.y);
  const labels = STEPS.map((s) => s.name);
  const colors = STEPS.map((s) => CONFORMATIONS[s.key].color);

  const [selected, setSelected] = useState(null);
  const [playIndex, setPlayIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState("normal");
  const intervalRef = useRef(null);

  const SPEEDS = { slow: 2000, normal: 1200, fast: 500 };

  const select = (state) => {
    setSelected((prev) => {
      const next = prev && prev.key === state.key ? null : state;
      onSelect?.(next ? next.key : "chair");
      return next;
    });
  };

  const startPlay = () => {
    setIsPlaying(true);
    setPlayIndex(0);
    setSelected(STEPS[0]);
    onSelect?.(STEPS[0].key);
  };

  const stopPlay = () => {
    setIsPlaying(false);
    setPlayIndex(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!isPlaying) return;

    intervalRef.current = setInterval(() => {
      setPlayIndex((prev) => {
        const next = prev + 1;
        if (next >= STEPS.length) {
          setIsPlaying(false);
          setPlayIndex(null);
          clearInterval(intervalRef.current);
          return prev;
        }
        setSelected(STEPS[next]);
        onSelect?.(STEPS[next].key);
        return next;
      });
    }, SPEEDS[speed]);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed]);

  // Active step: during playback use playIndex; otherwise use selected
  const activeStep = isPlaying && playIndex !== null ? STEPS[playIndex] : null;
  const displayState = activeStep ?? selected;

  const markerSizes = STEPS.map((s, i) => {
    if (isPlaying && i === playIndex) return 22;
    if (!isPlaying && selected && s.key === selected.key) return 20;
    return 14;
  });

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex gap-4 items-stretch">
        {/* Chart */}
        <div className="flex-1 min-h-[260px] rounded-2xl dark:bg-black/40 relative">
          <Plot
            data={[
              {
                x: xs,
                y: ys,
                type: "scatter",
                mode: "lines",
                line: { color: "rgba(16, 185, 129, 0.4)", width: 3, shape: "spline", smoothing: 1.0 },
                fill: "tozeroy",
                fillcolor: "rgba(16, 185, 129, 0.05)",
                hoverinfo: "skip",
                showlegend: false,
              },
              {
                x: xs,
                y: ys,
                type: "scatter",
                mode: "markers+text",
                text: labels,
                textposition: "top center",
                textfont: { color: colors, size: 11, family: "Inter, sans-serif" },
                marker: {
                  size: markerSizes,
                  color: colors,
                  line: { color: "#ffffff", width: 2 },
                },
                hovertemplate: "<b>%{text}</b><br>ΔG: %{y} kcal/mol<extra></extra>",
                showlegend: false,
              },
            ]}
            layout={{
              autosize: true,
              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "rgba(0,0,0,0)",
              margin: { l: 44, r: 16, t: 20, b: 28 },
              xaxis: {
                showgrid: false,
                zeroline: false,
                showticklabels: false,
                title: "Reaction Coordinate →",
                titlefont: { color: isDark ? "#94a3b8" : "#64748b", size: 11 },
              },
              yaxis: {
                title: "ΔG (kcal/mol)",
                titlefont: { color: isDark ? "#94a3b8" : "#64748b", size: 11 },
                tickfont: { color: isDark ? "#64748b" : "#94a3b8", size: 9 },
                gridcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
                zerolinecolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                range: [-1, 13],
              },
              font: { family: "Inter, system-ui, sans-serif" },
              hovermode: "closest",
            }}
            config={{ displayModeBar: false, responsive: true }}
            useResizeHandler
            style={{ width: "100%", height: "100%" }}
          />

          {/* Play progress bar */}
          {isPlaying && playIndex !== null && (
            <div className="absolute bottom-1 left-4 right-4 h-0.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-1000"
                style={{ width: `${((playIndex + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="w-40 flex-shrink-0 flex flex-col">
          {displayState ? (
            <div
              className="rounded-2xl border bg-white/80 dark:bg-black/60 backdrop-blur-xl p-4 flex flex-col items-center justify-center gap-3 h-full transition-all duration-300"
              style={{ borderColor: CONFORMATIONS[displayState.key].color + "50" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
                style={{ background: CONFORMATIONS[displayState.key].color + "20", boxShadow: `0 0 24px ${CONFORMATIONS[displayState.key].color}40` }}
              >
                <div className="w-5 h-5 rounded-full" style={{ background: CONFORMATIONS[displayState.key].color }} />
              </div>
              <div className="text-center space-y-1">
                <div className="font-bold text-sm" style={{ color: CONFORMATIONS[displayState.key].color }}>
                  {displayState.name}
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                  {STATE_DESCRIPTORS[displayState.key]}
                </div>
                <div className="font-mono text-xs text-slate-500 mt-1 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg">
                  ΔG = <span style={{ color: CONFORMATIONS[displayState.key].color }}>{displayState.y}</span> kcal/mol
                </div>
              </div>
              {!isPlaying && (
                <button
                  onClick={() => { setSelected(null); onSelect?.("chair"); }}
                  className="text-[10px] text-slate-500 hover:text-foreground transition-colors px-2 py-0.5 rounded border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30"
                >
                  ✕ close
                </button>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.015] h-full flex items-center justify-center p-4">
              <p className="text-[11px] text-slate-600 text-center leading-tight">
                Select a state<br />below or press<br />▶ Auto-Play
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Controls row */}
      <div className="flex gap-2 flex-wrap items-center justify-center">
        {/* Auto-play button */}
        {!isPlaying ? (
          <button
            onClick={startPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all duration-200"
          >
            ▶ Auto-Play Ring Flip
          </button>
        ) : (
          <button
            onClick={stopPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-all duration-200 animate-pulse"
          >
            ■ Stop
          </button>
        )}

        {/* Speed selector */}
        <div className="flex bg-black/5 dark:bg-white/5 rounded-full border border-black/10 dark:border-white/10 overflow-hidden">
          {["slow", "normal", "fast"].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className="px-2.5 py-1 text-[10px] font-semibold capitalize transition-all duration-150"
              style={{
                background: speed === s ? (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)") : "transparent",
                color:      speed === s ? (isDark ? "white" : "#0f172a") : "#475569",
              }}
            >
              {s === "slow" ? "0.5×" : s === "normal" ? "1×" : "2×"}
            </button>
          ))}
        </div>

        <span className="text-slate-600 text-xs">|</span>

        {/* State selector pills */}
        {UNIQUE_STATES.map((state) => (
          <button
            key={state.key}
            onClick={() => { stopPlay(); select(state); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border"
            style={{
              background:
                !isPlaying && selected && selected.key === state.key
                  ? CONFORMATIONS[state.key].color + "25"
                  : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"),
              borderColor:
                !isPlaying && selected && selected.key === state.key
                  ? CONFORMATIONS[state.key].color + "80"
                  : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"),
              color:
                !isPlaying && selected && selected.key === state.key
                  ? CONFORMATIONS[state.key].color
                  : "#64748b",
            }}
          >
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CONFORMATIONS[state.key].color }} />
            {state.name}
          </button>
        ))}
      </div>

      <p className="text-[10px] text-slate-600 text-center">
        Cyclohexane chair-flip free energy pathway · Click a state or press ▶ to animate
      </p>
    </div>
  );
}
