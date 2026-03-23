"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { CONFORMATIONS } from "./MolecularViewer";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// Known conformational states with their (phi1, phi2) coordinates
const STATES = [
  { key: "chair",      phi1: -50, phi2: 50,  label: "Chair" },
  { key: "chair",      phi1: 50,  phi2: -50, label: "Chair" },
  { key: "twist_boat", phi1: 50,  phi2: 50,  label: "Twist-Boat" },
  { key: "twist_boat", phi1: -50, phi2: -50, label: "Twist-Boat" },
  { key: "boat",       phi1: 0,   phi2: 0,   label: "Boat" },
  { key: "half_chair", phi1: -80, phi2: 0,   label: "Half-Chair" },
  { key: "half_chair", phi1: 80,  phi2: 0,   label: "Half-Chair" },
];

function findClosestState(phi1, phi2) {
  let minDist = Infinity;
  let closest = "chair";
  for (const s of STATES) {
    const d = Math.sqrt((phi1 - s.phi1) ** 2 + (phi2 - s.phi2) ** 2);
    if (d < minDist) {
      minDist = d;
      closest = s.key;
    }
  }
  return closest;
}

export default function InteractiveEnergyMap({ activeConformation, onSelect }) {
  const [fesData, setFesData] = useState(null);

  useEffect(() => {
    fetch("/homework1/fes_3d_data_100ns.json")
      .then((res) => res.json())
      .then(setFesData)
      .catch(console.error);
  }, []);

  // Build marker data for the known states
  const markers = useMemo(() => {
    if (!fesData) return null;
    
    const xs = [], ys = [], zs = [], texts = [], colors = [];
    const uniqueStates = [
      { key: "chair", phi1: -50, phi2: 50 },
      { key: "twist_boat", phi1: 50, phi2: 50 },
      { key: "boat", phi1: 0, phi2: 0 },
      { key: "half_chair", phi1: -80, phi2: 0 },
    ];

    for (const s of uniqueStates) {
      // Find the closest bin to get the z-value
      const xi = fesData.x.reduce((best, v, i) => Math.abs(v - s.phi1) < Math.abs(fesData.x[best] - s.phi1) ? i : best, 0);
      const yi = fesData.y.reduce((best, v, i) => Math.abs(v - s.phi2) < Math.abs(fesData.y[best] - s.phi2) ? i : best, 0);
      const z = fesData.z[xi][yi];
      
      const conf = CONFORMATIONS[s.key];
      xs.push(s.phi1);
      ys.push(s.phi2);
      zs.push(z + 0.5); // slightly above surface
      texts.push(`${conf.label}<br>${conf.energy}`);
      colors.push(conf.color);
    }

    return { xs, ys, zs, texts, colors };
  }, [fesData]);

  const handleClick = (event) => {
    if (event.points && event.points.length > 0) {
      const pt = event.points[0];
      const phi1 = pt.x;
      const phi2 = pt.y;
      const closest = findClosestState(phi1, phi2);
      onSelect(closest);
    }
  };

  if (!fesData) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const activeConf = CONFORMATIONS[activeConformation];

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="font-bold text-lg">3D Free Energy Surface</span>
        <span className="text-xs bg-white/5 px-3 py-1.5 rounded-lg font-mono" style={{ color: activeConf?.color }}>
          Active: {activeConf?.label}
        </span>
      </div>

      <div className="flex-1 min-h-[400px]">
        <Plot
          data={[
            // The 3D Surface
            {
              type: "surface",
              x: fesData.x,
              y: fesData.y,
              z: fesData.z,
              colorscale: [
                [0, "#0d1b2a"],
                [0.15, "#1b263b"],
                [0.3, "#415a77"],
                [0.45, "#778da9"],
                [0.6, "#e0e1dd"],
                [0.75, "#f59e0b"],
                [0.9, "#ef4444"],
                [1, "#7f1d1d"],
              ],
              colorbar: {
                title: { text: "ΔG (kcal/mol)", font: { color: "#e0e1dd", size: 11 } },
                tickfont: { color: "#94a3b8", size: 10 },
                bgcolor: "rgba(0,0,0,0)",
                bordercolor: "rgba(255,255,255,0.1)",
                len: 0.6,
                thickness: 15,
              },
              opacity: 0.92,
              contours: {
                z: { show: true, usecolormap: true, highlightcolor: "#ffffff", project: { z: false } },
              },
              hovertemplate: "φ₁: %{x:.1f}°<br>φ₂: %{y:.1f}°<br>ΔG: %{z:.2f} kcal/mol<extra></extra>",
            },
            // Markers for known states
            ...(markers ? [{
              type: "scatter3d",
              mode: "markers+text",
              x: markers.xs,
              y: markers.ys,
              z: markers.zs,
              text: ["Chair", "Twist-Boat", "Boat", "Half-Chair"],
              textposition: "top center",
              textfont: { color: markers.colors, size: 11, family: "Inter, sans-serif" },
              marker: {
                size: 8,
                color: markers.colors,
                symbol: "diamond",
                line: { color: "white", width: 1 },
              },
              hovertext: markers.texts,
              hoverinfo: "text",
            }] : []),
          ]}
          layout={{
            autosize: true,
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            margin: { l: 0, r: 0, t: 0, b: 0 },
            scene: {
              xaxis: {
                title: { text: "φ₁ (degrees)", font: { color: "#94a3b8", size: 12 } },
                tickfont: { color: "#64748b", size: 10 },
                gridcolor: "rgba(255,255,255,0.05)",
                zerolinecolor: "rgba(255,255,255,0.1)",
                backgroundcolor: "rgba(0,0,0,0)",
              },
              yaxis: {
                title: { text: "φ₂ (degrees)", font: { color: "#94a3b8", size: 12 } },
                tickfont: { color: "#64748b", size: 10 },
                gridcolor: "rgba(255,255,255,0.05)",
                zerolinecolor: "rgba(255,255,255,0.1)",
                backgroundcolor: "rgba(0,0,0,0)",
              },
              zaxis: {
                title: { text: "ΔG (kcal/mol)", font: { color: "#94a3b8", size: 12 } },
                tickfont: { color: "#64748b", size: 10 },
                gridcolor: "rgba(255,255,255,0.05)",
                zerolinecolor: "rgba(255,255,255,0.1)",
                backgroundcolor: "rgba(0,0,0,0)",
              },
              bgcolor: "rgba(0,0,0,0)",
              camera: {
                eye: { x: 1.5, y: -1.5, z: 1.2 },
              },
            },
            font: { family: "Inter, system-ui, sans-serif" },
          }}
          config={{
            displayModeBar: false,
            responsive: true,
          }}
          onClick={handleClick}
          useResizeHandler
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <p className="text-xs text-center text-muted-foreground py-2">
        Drag to rotate • Click surface to explore conformations
      </p>
    </div>
  );
}
