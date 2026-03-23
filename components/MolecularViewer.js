"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CONFORMATIONS = {
  chair:      { label: "Chair",      color: "#10b981", energy: "0.0 kcal/mol",   phi: { phi1: -50, phi2: 50  }, file: "/homework1/chair.pdb"      },
  twist_boat: { label: "Twist-Boat", color: "#f59e0b", energy: "~5.5 kcal/mol",  phi: { phi1:  50, phi2: 50  }, file: "/homework1/twist_boat.pdb" },
  boat:       { label: "Boat",       color: "#3b82f6", energy: "~7.5 kcal/mol",  phi: { phi1:   0, phi2:  0  }, file: "/homework1/boat.pdb"       },
  half_chair: { label: "Half-Chair", color: "#ef4444", energy: "~10.5 kcal/mol", phi: { phi1: -80, phi2:  0  }, file: "/homework1/half_chair.pdb" },
};

// Style presets we expose to the user
const STYLES = [
  { key: "ball-stick", label: "Ball & Stick", icon: "⬤" },
  { key: "sphere",     label: "Spheres",      icon: "●" },
  { key: "stick",      label: "Sticks",       icon: "—" },
];

function applyStyle(viewer, key, conf) {
  viewer.setStyle({}, {}); // clear all first

  if (key === "ball-stick") {
    viewer.setStyle({}, { stick: { radius: 0.15 } });
    viewer.setStyle({ elem: "C" }, {
      stick:  { radius: 0.2, color: conf.color },
      sphere: { radius: 0.4, color: conf.color },
    });
    viewer.setStyle({ elem: "H" }, {
      stick:  { radius: 0.1,  color: "#94a3b8" },
      sphere: { radius: 0.15, color: "#94a3b8" },
    });

  } else if (key === "sphere") {
    viewer.setStyle({ elem: "C" }, { sphere: { radius: 0.55, color: conf.color } });
    viewer.setStyle({ elem: "H" }, { sphere: { radius: 0.35, color: "#94a3b8" } });

  } else if (key === "stick") {
    viewer.setStyle({}, { stick: { radius: 0.15 } });
    viewer.setStyle({ elem: "C" }, { stick: { radius: 0.22, color: conf.color } });
    viewer.setStyle({ elem: "H" }, { stick: { radius: 0.08, color: "#64748b" } });
  }

  viewer.render();
}

export default function MolecularViewer({ activeConformation = "chair" }) {
  const containerRef = useRef(null);
  const viewerRef    = useRef(null);
  const [loading, setLoading]     = useState(true);
  const [viewStyle, setViewStyle] = useState("ball-stick");
  const [spinning, setSpinning]   = useState(true);
  const spinningRef = useRef(true);

  const toggleSpin = useCallback(() => {
    setSpinning((prev) => {
      const next = !prev;
      spinningRef.current = next;
      if (!viewerRef.current) return next;
      if (next) {
        viewerRef.current.spin("y", 0.5);
      } else {
        viewerRef.current.stopAnimation();
      }
      return next;
    });
  }, []);

  // Init viewer once on mount
  useEffect(() => {
    const init = async () => {
      const $3Dmol = await import("3dmol");
      if (!containerRef.current) return;
      containerRef.current.innerHTML = "";
      const viewer = $3Dmol.createViewer(containerRef.current, {
        backgroundColor: "rgba(0,0,0,0)",
        antialias: true,
        disableFog: true,
      });
      viewerRef.current = viewer;
      await loadConformation(viewer, $3Dmol, activeConformation, "ball-stick");
    };
    init();
    return () => { viewerRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload when conformation changes
  useEffect(() => {
    const reload = async () => {
      if (!viewerRef.current) return;
      const $3Dmol = await import("3dmol");
      await loadConformation(viewerRef.current, $3Dmol, activeConformation, viewStyle);
    };
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConformation]);

  // Re-style without reloading when style toggle changes
  useEffect(() => {
    if (!viewerRef.current) return;
    const conf = CONFORMATIONS[activeConformation];
    applyStyle(viewerRef.current, viewStyle, conf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewStyle]);

  async function loadConformation(viewer, $3Dmol, key, style) {
    setLoading(true);
    const conf = CONFORMATIONS[key];
    if (!conf) return;
    try {
      const pdbData = await fetch(conf.file).then((r) => r.text());
      viewer.removeAllModels();
      viewer.addModel(pdbData, "pdb");
      applyStyle(viewer, style, conf);
      viewer.zoomTo();
      if (spinningRef.current) viewer.spin("y", 0.5);
    } catch (err) {
      console.error("Error loading PDB:", err);
    } finally {
      setLoading(false);
    }
  }

  const conf = CONFORMATIONS[activeConformation];

  return (
    <div className="relative h-full w-full flex flex-col">
      {/* Info bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="h-3 w-3 rounded-full flex-shrink-0 animate-pulse"
            style={{ backgroundColor: conf?.color, boxShadow: `0 0 10px ${conf?.color}` }}
          />
          <span className="font-bold text-lg" style={{ color: conf?.color }}>
            {conf?.label}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-slate-500 font-mono bg-black/5 dark:bg-white/5 px-2 py-1 rounded-lg">
            φ₁&nbsp;<span className="text-slate-600 dark:text-slate-300">{conf?.phi.phi1 > 0 ? "+" : ""}{conf?.phi.phi1}°</span>
            &nbsp;φ₂&nbsp;<span className="text-slate-600 dark:text-slate-300">{conf?.phi.phi2 > 0 ? "+" : ""}{conf?.phi.phi2}°</span>
          </span>
          <span className="text-xs text-muted-foreground bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-lg font-mono">
            {conf?.energy}
          </span>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="relative flex-1 min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div
              className="animate-spin h-8 w-8 border-4 border-t-transparent rounded-full"
              style={{ borderColor: `${conf?.color} transparent ${conf?.color} ${conf?.color}` }}
            />
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" style={{ minHeight: "300px" }} />
      </div>

      {/* Bottom bar: style controls + spin toggle + hint */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-black/5 dark:border-white/5 gap-2">
        {/* Style switcher */}
        <div className="flex gap-1">
          {STYLES.map((s) => (
            <button
              key={s.key}
              title={s.label}
              onClick={() => setViewStyle(s.key)}
              className="px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-150"
              style={{
                background: viewStyle === s.key ? (conf?.color + "25") : "rgba(128,128,128,0.06)",
                color:      viewStyle === s.key ? conf?.color           : "#475569",
                border:     viewStyle === s.key ? `1px solid ${conf?.color}50` : "1px solid rgba(128,128,128,0.15)",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSpin}
            title={spinning ? "Pause rotation" : "Resume rotation"}
            className="px-2 py-0.5 rounded text-[10px] font-medium transition-all duration-150"
            style={{
              background: spinning ? (conf?.color + "15") : "rgba(128,128,128,0.06)",
              color:      spinning ? conf?.color           : "#475569",
              border:     spinning ? `1px solid ${conf?.color}40` : "1px solid rgba(128,128,128,0.15)",
            }}
          >
            {spinning ? "⏸ Spin" : "▶ Spin"}
          </button>
          <p className="text-[10px] text-slate-600">Drag · Scroll</p>
        </div>
      </div>
    </div>
  );
}

export { CONFORMATIONS };
