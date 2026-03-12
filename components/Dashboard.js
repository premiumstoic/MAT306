"use client";

import { useState, useEffect } from "react";
import TrajectoryChart from "./charts/TrajectoryChart";
import EnergyChart from "./charts/EnergyChart";
import DownloadCards from "./DownloadCards";
import Latex from "react-latex-next";

export default function Dashboard() {
  const [metadata, setMetadata] = useState(null);
  const [currentTemp, setCurrentTemp] = useState(300);
  const [simData, setSimData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load available temperatures and their summaries
  useEffect(() => {
    fetch("/data/temperatures.json")
      .then((res) => res.json())
      .then((data) => {
        setMetadata(data);
      })
      .catch((err) => console.error("Error loading temperatures:", err));
  }, []);

  // Load specific temperature data
  useEffect(() => {
    setLoading(true);
    fetch(`/data/butane_${currentTemp}K.json`)
      .then((res) => res.json())
      .then((data) => {
        setSimData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Error loading data for ${currentTemp}K:`, err);
        setLoading(false);
      });
  }, [currentTemp]);

  if (!metadata) {
    return (
      <div className="h-96 glass-panel rounded-2xl flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3 text-lg font-medium text-muted-foreground">
          <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin"/>
          Loading initialization data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="glass-panel rounded-2xl p-4 md:p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between z-10 relative">
        <div className="space-y-1">
          <h2 className="text-lg font-medium text-foreground">Simulation Temperature</h2>
          <p className="text-sm text-muted-foreground">Select a temperature to view the dihedral energy landscape.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {metadata.temperatures.map((temp) => (
            <button
              key={temp}
              onClick={() => setCurrentTemp(temp)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                currentTemp === temp
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 border border-white/5"
              }`}
            >
              {temp} K
            </button>
          ))}
        </div>
      </div>

      {loading || !simData ? (
        <div className="h-[600px] glass-panel rounded-2xl flex justify-center items-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"/>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Summary & Explanation */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"/> System State
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Temperature</p>
                    <p className="text-2xl font-black">{currentTemp} K</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Sim Time</p>
                    <p className="text-2xl font-black">{simData.summary.simulation_time_ns} ns</p>
                  </div>
                </div>
                
                <h4 className="text-sm font-semibold text-muted-foreground pt-4 border-t border-white/10 mb-2">Conformational Populations</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-emerald-400 font-medium tracking-wide">Trans <span className="text-white/40">~180°</span></span>
                      <span className="font-mono">{simData.summary.trans_pct}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${simData.summary.trans_pct}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-amber-400 font-medium tracking-wide">Gauche<sup className="-top-1 text-xs">−</sup> <span className="text-white/40">~60°</span></span>
                      <span className="font-mono">{simData.summary.gauche_minus_pct}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${simData.summary.gauche_minus_pct}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-indigo-400 font-medium tracking-wide">Gauche<sup className="-top-1 text-xs">+</sup> <span className="text-white/40">~300°</span></span>
                      <span className="font-mono">{simData.summary.gauche_plus_pct}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" style={{ width: `${simData.summary.gauche_plus_pct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl text-sm leading-relaxed text-muted-foreground space-y-4">
              <h3 className="text-lg font-bold text-foreground">The Physics</h3>
              <p>
                At low temperatures (e.g. 150K), butane stays trapped in its lowest energy <strong>trans</strong> state, lacking the thermal energy <Latex>$k_B T$</Latex> to overcome the barrier to gauche.
              </p>
              <p>
                As temperature increases to 300K and beyond, the molecule frequently explores the <strong>gauche</strong> states, demonstrating the Boltzmann distribution <Latex>$P(\phi) \propto \exp(-\Delta G(\phi)/k_B T)$</Latex>.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl text-sm leading-relaxed text-muted-foreground space-y-4">
              <h3 className="text-lg font-bold text-rose-400">Why Stop at 600K?</h3>
              <p>
                <strong>The &quot;Unbreakable Spring&quot; Problem:</strong> In reality, heating butane to 1200K pumps massive amounts of kinetic energy into the system, causing the covalent bonds to physically break (thermal cracking).
              </p>
              <p>
                However, our simulation uses a classical force field that ignores electrons. It treats bonds as indestructible springs governed by a simple harmonic oscillator:
              </p>
              <div className="bg-black/30 p-4 rounded-lg border border-white/5 font-mono text-center text-base text-rose-300">
                <Latex>{`$E = \\frac{1}{2}k(x-x_0)^2$`}</Latex>
              </div>
              <p>
                This equation has no rule for snapping. At 1200K, the simulated atoms fly apart to absurd lengths and violently rubber-band back together. We stop at 600K to ensure we collect physically meaningful thermodynamic data rather than simulating an indestructible mutant molecule!
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Charts */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-6 rounded-2xl h-[400px]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">Free Energy Profile & Probability</h3>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-md">Boltzmann Inversion</span>
              </div>
              <EnergyChart freeEnergy={simData.freeEnergy} histogram={simData.histogram} />
            </div>

            <div className="glass-panel p-6 rounded-2xl h-[400px]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">Dihedral Trajectory (100 ns)</h3>
                <span className="text-xs bg-white/10 px-2 py-1 rounded-md">Time series</span>
              </div>
              <TrajectoryChart trajectory={simData.trajectory} temp={currentTemp} />
            </div>
            
            {/* Raw Data Downloads Row */}
            <DownloadCards temp={currentTemp} />
          </div>
        </div>
      )}
    </div>
  );
}
