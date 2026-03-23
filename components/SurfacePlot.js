"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// Preset colorscales
const COLORSCALES = {
  probability: [
    [0, "#0d0221"],
    [0.1, "#1a1a5e"],
    [0.25, "#0d3d6e"],
    [0.4, "#0f7f88"],
    [0.55, "#15b097"],
    [0.7, "#f0e442"],
    [0.85, "#ff9f00"],
    [1, "#ff3a00"],
  ],
  energy: [
    [0, "#0d1b2a"],
    [0.15, "#1b263b"],
    [0.3, "#415a77"],
    [0.45, "#778da9"],
    [0.6, "#e0e1dd"],
    [0.75, "#f59e0b"],
    [0.9, "#ef4444"],
    [1, "#7f1d1d"],
  ],
};

export default function SurfacePlot({ dataUrl, title, zTitle, colorscaleKey = "energy", height = 450 }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(dataUrl)
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(e.message));
  }, [dataUrl]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-400 text-sm">
        Failed to load: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl" style={{ height }}>
      <Plot
        data={[
          {
            type: "surface",
            x: data.x,
            y: data.y,
            z: data.z,
            colorscale: COLORSCALES[colorscaleKey],
            colorbar: {
              title: { text: zTitle, font: { color: "#e0e1dd", size: 11 } },
              tickfont: { color: "#94a3b8", size: 10 },
              bgcolor: "rgba(0,0,0,0)",
              bordercolor: "rgba(255,255,255,0.1)",
              len: 0.7,
              thickness: 14,
            },
            opacity: 0.95,
            hovertemplate: `φ₁: %{x:.1f}°<br>φ₂: %{y:.1f}°<br>${zTitle}: %{z:.4f}<extra></extra>`,
          },
        ]}
        layout={{
          autosize: true,
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          margin: { l: 0, r: 0, t: 0, b: 0 },
          scene: {
            xaxis: {
              title: { text: "φ₁ (°)", font: { color: "#94a3b8", size: 11 } },
              tickfont: { color: "#64748b", size: 9 },
              gridcolor: "rgba(255,255,255,0.05)",
              backgroundcolor: "rgba(0,0,0,0)",
            },
            yaxis: {
              title: { text: "φ₂ (°)", font: { color: "#94a3b8", size: 11 } },
              tickfont: { color: "#64748b", size: 9 },
              gridcolor: "rgba(255,255,255,0.05)",
              backgroundcolor: "rgba(0,0,0,0)",
            },
            zaxis: {
              title: { text: zTitle, font: { color: "#94a3b8", size: 11 } },
              tickfont: { color: "#64748b", size: 9 },
              gridcolor: "rgba(255,255,255,0.05)",
              backgroundcolor: "rgba(0,0,0,0)",
            },
            bgcolor: "rgba(0,0,0,0)",
            camera: { eye: { x: 1.4, y: -1.4, z: 1.0 } },
          },
          font: { family: "Inter, system-ui, sans-serif" },
          uirevision: 'true', // Preserve camera rotation across data changes
        }}
        config={{ displayModeBar: false, responsive: true }}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
