"use client";

import { useMemo } from "react";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { useTheme } from "@/components/ThemeProvider";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="glass-panel text-sm p-3 rounded-lg shadow-xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/80">
        <p className="font-mono text-muted-foreground mb-1"><span className="text-foreground">Time:</span> {data.time} ps</p>
        <p className="font-mono text-primary"><span className="text-foreground">Angle:</span> {data.angle}°</p>
      </div>
    );
  }
  return null;
};

export default function TrajectoryChart({ trajectory, temp }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";
  const tickColor = isDark ? "rgba(255,255,255,0.5)" : "#64748b";
  const axisColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  const data = useMemo(() => {
    return trajectory.time_ps.map((time, i) => ({
      time: time,
      angle: trajectory.angle_deg[i],
    }));
  }, [trajectory]);

  const dotColor = useMemo(() => {
    if (temp <= 200) return "#3b82f6";
    if (temp <= 300) return "#10b981";
    if (temp <= 450) return "#f59e0b";
    return "#ef4444";
  }, [temp]);

  return (
    <div className="w-full h-full pb-6">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />

          <XAxis
            type="number"
            dataKey="time"
            name="Time"
            unit=" ps"
            domain={['dataMin', 'dataMax']}
            tick={{ fill: tickColor, fontSize: 12 }}
            axisLine={{ stroke: axisColor }}
            tickLine={false}
          />

          <YAxis
            type="number"
            dataKey="angle"
            name="Angle"
            domain={[0, 360]}
            ticks={[0, 60, 180, 300, 360]}
            tick={{ fill: tickColor, fontSize: 12 }}
            axisLine={{ stroke: axisColor }}
            tickLine={false}
          />

          <ReferenceLine y={60} stroke="rgba(245, 158, 11, 0.3)" strokeDasharray="3 3" />
          <ReferenceLine y={180} stroke="rgba(16, 185, 129, 0.3)" strokeDasharray="3 3" />
          <ReferenceLine y={300} stroke="rgba(99, 102, 241, 0.3)" strokeDasharray="3 3" />

          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }} />

          <Scatter
            name="Trajectory"
            data={data}
            fill={dotColor}
            line={{ stroke: dotColor, strokeWidth: 1, opacity: 0.3 }}
            shape="circle"
            lineType="joint"
            opacity={0.6}
            r={2}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
