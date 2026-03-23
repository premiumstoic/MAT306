"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Latex from "@/components/Latex";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// Gas constant in kcal/(mol·K)
const R = 0.001987;

const PRESETS = [
  { label: "Chair → Half-Chair",  dE: 10.8, color: "#f43f5e" },
  { label: "Chair → Boat",        dE: 7.5,  color: "#f59e0b" },
  { label: "Chair → Twist-Boat",  dE: 5.5,  color: "#10b981" },
  { label: "Twist-Boat → Boat",   dE: 2.0,  color: "#60a5fa" },
];

function boltzmann(dE, T) {
  return Math.exp(-dE / (R * T));
}

function fmt(n, digits = 4) {
  if (n >= 0.01) return n.toFixed(digits);
  return n.toExponential(2);
}

export default function BoltzmannCalculator() {
  const [dE, setDE] = useState(10.8);
  const [T, setT] = useState(1000);

  const RT     = R * T;
  const ratio  = dE / RT;
  const P      = boltzmann(dE, T);
  const P300   = boltzmann(dE, 300);
  const relTo300 = P / P300;

  // Curve data: P vs T from 200 K to 2000 K
  const Ts = useMemo(() => Array.from({ length: 181 }, (_, i) => 200 + i * 10), []);
  const Ps = useMemo(() => Ts.map((t) => boltzmann(dE, t)), [dE, Ts]);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-emerald-400">Boltzmann Factor Calculator</h3>
        <p className="text-sm text-muted-foreground">
          Explore how temperature controls the probability of crossing an energy barrier.
        </p>
        <div className="text-center bg-white/5 py-3 rounded-xl border border-white/10">
          <Latex>{`$P \\propto e^{-\\Delta E / RT}$`}</Latex>
        </div>
      </div>

      {/* Preset buttons */}
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold">
          Cyclohexane barriers
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => setDE(p.dE)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border"
              style={{
                borderColor: Math.abs(dE - p.dE) < 0.01 ? p.color : "rgba(255,255,255,0.1)",
                background:  Math.abs(dE - p.dE) < 0.01 ? p.color + "20" : "rgba(255,255,255,0.04)",
                color:       Math.abs(dE - p.dE) < 0.01 ? p.color : "#94a3b8",
              }}
            >
              {p.label}
              <span className="ml-1.5 opacity-70">{p.dE} kcal/mol</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="text-sm font-semibold text-white">Energy Barrier (ΔE)</label>
            <span className="text-emerald-400 font-mono text-sm">{dE.toFixed(1)} kcal/mol</span>
          </div>
          <input
            type="range" min="0.5" max="15" step="0.1"
            value={dE}
            onChange={(e) => setDE(parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60">
            <span>0.5</span><span>15 kcal/mol</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="text-sm font-semibold text-white">Temperature (T)</label>
            <span className="text-emerald-400 font-mono text-sm">{T} K</span>
          </div>
          <input
            type="range" min="100" max="2000" step="10"
            value={T}
            onChange={(e) => setT(parseInt(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60">
            <span>100 K</span><span>2000 K</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "RT",          value: `${(RT * 1000).toFixed(1)} cal/mol`, sub: `${RT.toFixed(4)} kcal/mol` },
          { label: "ΔE / RT",     value: ratio.toFixed(2),                    sub: "dimensionless" },
          { label: "P = e^(−ΔE/RT)", value: fmt(P),                           sub: "Boltzmann factor", highlight: true },
          { label: "vs 300 K",    value: relTo300 >= 1 ? `×${relTo300.toFixed(1)}` : `÷${(1/relTo300).toFixed(1)}`, sub: relTo300 >= 1 ? "more likely" : "less likely" },
        ].map(({ label, value, sub, highlight }) => (
          <div
            key={label}
            className="rounded-xl p-3 border text-center"
            style={{
              background: highlight ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.04)",
              borderColor: highlight ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)",
            }}
          >
            <p className="text-[10px] text-muted-foreground mb-1 leading-tight">{label}</p>
            <p className="text-base font-bold font-mono" style={{ color: highlight ? "#10b981" : "white" }}>
              {value}
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-2xl overflow-hidden border border-white/10" style={{ height: 240 }}>
        <Plot
          data={[
            {
              type: "scatter",
              mode: "lines",
              x: Ts, y: Ps,
              line: { color: "#10b981", width: 2 },
              name: "P(T)",
              hovertemplate: "T: %{x} K<br>P: %{y:.4e}<extra></extra>",
            },
            {
              type: "scatter",
              mode: "markers",
              x: [T], y: [P],
              marker: { size: 10, color: "#f59e0b", line: { color: "white", width: 1.5 } },
              name: "Current T",
              hovertemplate: `T=${T} K<br>P=${fmt(P)}<extra></extra>`,
            },
          ]}
          layout={{
            autosize: true,
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            margin: { l: 56, r: 12, t: 10, b: 42 },
            xaxis: {
              title: { text: "Temperature (K)", font: { color: "#94a3b8", size: 11 } },
              tickfont: { color: "#64748b", size: 9 },
              gridcolor: "rgba(255,255,255,0.06)",
              zerolinecolor: "rgba(255,255,255,0.1)",
            },
            yaxis: {
              title: { text: "Boltzmann Factor", font: { color: "#94a3b8", size: 11 } },
              tickfont: { color: "#64748b", size: 9 },
              gridcolor: "rgba(255,255,255,0.06)",
              zerolinecolor: "rgba(255,255,255,0.1)",
              type: "log",
            },
            font: { family: "Inter, system-ui, sans-serif" },
            showlegend: false,
          }}
          config={{ displayModeBar: false, responsive: true }}
          useResizeHandler
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center -mt-2">
        Log scale — yellow dot marks your current (T, ΔE) pair
      </p>
    </div>
  );
}
