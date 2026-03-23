"use client";

import { useMemo } from "react";
import { ResponsiveContainer, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Line } from "recharts";
import { useTheme } from "@/components/ThemeProvider";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-panel text-sm p-3 rounded-lg shadow-xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/80">
        <p className="font-mono text-muted-foreground mb-1"><span className="text-foreground">Angle:</span> {data.angle}°</p>
        <p className="font-mono text-blue-600 dark:text-blue-400"><span className="text-foreground">Probability:</span> {data.prob ? (data.prob * 100).toFixed(2) + "%" : "0%"}</p>
        {data.energy !== null && (
          <p className="font-mono text-rose-600 dark:text-rose-400"><span className="text-foreground">Free Energy:</span> {data.energy.toFixed(1)} kJ/mol</p>
        )}
      </div>
    );
  }
  return null;
};

export default function EnergyChart({ freeEnergy }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const tickColor = isDark ? "rgba(255,255,255,0.5)" : "#64748b";
  const axisColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  const data = useMemo(() => {
    return freeEnergy.bin_centers.map((center, i) => ({
      angle: center,
      prob: freeEnergy.probability[i],
      energy: freeEnergy.delta_g_kj_mol[i],
    }));
  }, [freeEnergy]);

  return (
    <div className="w-full h-full pb-6">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />

          <XAxis
            dataKey="angle"
            type="number"
            domain={[0, 360]}
            ticks={[0, 60, 120, 180, 240, 300, 360]}
            tick={{ fill: tickColor, fontSize: 12 }}
            axisLine={{ stroke: axisColor }}
            tickLine={false}
          />

          <YAxis
            yAxisId="prob"
            orientation="left"
            tickFormatter={(val) => (val * 100).toFixed(0) + "%"}
            tick={{ fill: isDark ? "rgba(96, 165, 250, 0.7)" : "#3b82f6", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            yAxisId="energy"
            orientation="right"
            domain={[0, 30]}
            tickFormatter={(val) => val}
            tick={{ fill: isDark ? "rgba(251, 113, 133, 0.7)" : "#f43f5e", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />

          <ReferenceLine x={60} stroke={axisColor} strokeDasharray="3 3" />
          <ReferenceLine x={180} stroke={axisColor} strokeDasharray="3 3" />
          <ReferenceLine x={300} stroke={axisColor} strokeDasharray="3 3" />

          <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }} />

          <Area
            yAxisId="prob"
            type="monotone"
            dataKey="prob"
            fill="url(#colorProb)"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            animationDuration={1500}
          />

          <Line
            yAxisId="energy"
            type="monotone"
            dataKey="energy"
            stroke="#fb7185"
            strokeWidth={3}
            dot={false}
            connectNulls={false}
            animationDuration={1500}
          />

          <defs>
            <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
