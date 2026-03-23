"use client";

import { useState } from "react";
import Image from "next/image";
import Latex from "@/components/Latex";
import MolecularViewer, { CONFORMATIONS } from "@/components/MolecularViewer";
import InteractiveEnergyMap from "@/components/InteractiveEnergyMap";
import SurfacePlot from "@/components/SurfacePlot";
import ReactionCoordinateChart from "@/components/ReactionCoordinateChart";
import BoltzmannCalculator from "@/components/BoltzmannCalculator";
import PageTOC from "@/components/PageTOC";

const ENERGY_ROWS = [
  { key: "chair",      label: "Chair",       feature: "Global Minimum",          energy: "0.0 kcal/mol"  },
  { key: "twist_boat", label: "Twist-Boat",  feature: "Local Minimum",           energy: "~ 5.5 kcal/mol" },
  { key: "boat",       label: "Boat",        feature: "Saddle Point / Transition", energy: "~ 7.5 kcal/mol" },
  { key: "half_chair", label: "Half-Chair",  feature: "Primary Energy Barrier",  energy: "~ 10.5 kcal/mol" },
];

export default function Homework1() {
  const [activeConformation, setActiveConformation] = useState("chair");
  const [simLength, setSimLength] = useState("100ns");
  return (
    <main className="min-h-screen p-4 md:p-8 xl:p-12 max-w-[1600px] mx-auto space-y-16">
      <PageTOC />
      <header className="space-y-6 text-center md:text-left">
        <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
          MAT 306 — Homework 1
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent">
          Conformational Free Energy Surface of Cyclohexane
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl leading-relaxed">
          Computational Techniques for Materials at the Nano-scale.
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground/80 justify-center md:justify-start">
          <span>Author: Ahmet Ekiz</span>
          <span>•</span>
          <span>AI Used: Google Gemini 3.1 Pro</span>
        </div>
      </header>

      {/* Section 1 */}
      <section id="section-intro" className="space-y-6">
        <h2 className="text-3xl font-bold border-b border-white/10 pb-4">1. Aim & Introduction</h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              The primary objective of this study is to construct the conformational free energy surface of cyclohexane. 
              To achieve this, the probability distributions of the ring's dihedral angles will be analyzed using trajectory 
              data from 20 ns and 100 ns molecular dynamics (MD) simulations performed in NAMD at an elevated temperature of 1000 K.
            </p>
            <p>
              The molecule transitions between four primary states: the highly stable <strong>chair</strong>, the <strong>twist-boat</strong>, 
              the <strong>boat</strong>, and the highly strained <strong>half-chair</strong> transition state. The thermodynamic probability 
              of overcoming energy barriers to reach these different states is governed by the Boltzmann factor:
            </p>
            <div className="text-center bg-white/5 py-4 rounded-xl border border-white/10 my-6">
              <Latex>{`$P \\propto e^{-\\Delta E / RT}$`}</Latex>
            </div>
            <p>
              The energy barrier to undergo a "ring flip" (passing from a chair to a twist-boat via the half-chair) is approximately 10.8 kcal/mol. 
              By artificially elevating the simulation temperature to 1000 K, the thermal energy increases to ≈ 2.0 kcal/mol, allowing the system 
              to thoroughly sample rare transition states.
            </p>
          </div>
          
          <div className="glass-panel p-4 rounded-3xl border border-white/10 shadow-2xl">
            <ReactionCoordinateChart onSelect={setActiveConformation} />
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section id="section-methods" className="glass-panel p-8 rounded-3xl space-y-6 bg-gradient-to-br from-white/5 to-transparent border border-white/10">
        <h2 className="text-3xl font-bold">2. Methods</h2>
        <p className="text-muted-foreground leading-relaxed max-w-5xl">
          Molecular dynamics simulations of a single cyclohexane (C₆H₁₂) molecule were performed using NAMD. 
          Interactions were described using the CHARMM general parameter set (<code>par_all35_ethers-2.prm</code>). 
          Two separate simulations were conducted for continuous durations of 20 ns and 100 ns, both utilizing a 1 fs integration timestep.
        </p>
        <p className="text-muted-foreground leading-relaxed max-w-5xl">
          The simulation temperature was maintained at a constant 1000 K using a <strong>Langevin dynamics thermostat</strong>. 
          Hydrogen atoms were intentionally excluded from this thermal coupling to prevent integration instabilities and unnatural high-frequency movements arising from their extremely low mass.
        </p>
      </section>

      {/* Section 3 */}
      <section id="section-results" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
          <div>
            <h2 className="text-3xl font-bold">3. Results (Probability & Free Energy)</h2>
            <p className="text-muted-foreground mt-2">Observe how increasing the simulation length improves phase space exploration.</p>
          </div>
          
          {/* Simulation Length Toggle */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => setSimLength("20ns")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                simLength === "20ns"
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              20 ns Simulation
            </button>
            <button
              onClick={() => setSimLength("100ns")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                simLength === "100ns"
                  ? "bg-emerald-500/20 text-emerald-400 shadow-lg"
                  : "text-muted-foreground hover:text-white"
              }`}
            >
              100 ns Simulation
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-panel p-6 rounded-3xl space-y-4 relative overflow-hidden">
            {simLength === "20ns" && (
              <div className="absolute top-4 right-4 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold animate-pulse z-10">
                Incomplete Sampling
              </div>
            )}
            <h3 className="text-xl font-bold text-center">Probability Surface</h3>
            <SurfacePlot
              dataUrl={`/homework1/prob_3d_data_${simLength}.json`}
              title="Probability Surface"
              zTitle="Probability"
              colorscaleKey="probability"
              height={420}
            />
            <p className="text-sm text-muted-foreground text-center">
              Smoothed {simLength.replace("ns", " ns")} probability distribution P(φ₁, φ₂). Peaks = frequently visited states.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <h3 className="text-xl font-bold text-center">Free Energy Surface (FES)</h3>
            <SurfacePlot
              dataUrl={`/homework1/fes_3d_data_${simLength}.json`}
              title="Free Energy Surface"
              zTitle="ΔG (kcal/mol)"
              colorscaleKey="energy"
              height={420}
            />
            <p className="text-sm text-muted-foreground text-center">
              Free Energy Surface ΔG(φ₁, φ₂) from the {simLength.replace("ns", " ns")} trajectory at 1000 K.
            </p>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 max-w-4xl mx-auto mt-12 bg-black/40 shadow-2xl shadow-emerald-500/10">
          <h3 className="text-2xl font-bold mb-6 text-emerald-400">Energy Summary</h3>
          <p className="text-muted-foreground mb-8">
            The global minima, corresponding to the chair conformations, are located at (φ₁ ≈ -50°, φ₂ ≈ 50°) and (φ₁ ≈ 50°, φ₂ ≈ -50°). 
            Local minima representing twist-boat conformations are found at (φ₁ ≈ 50°, φ₂ ≈ 50°) and (φ₁ ≈ -50°, φ₂ ≈ -50°). 
            Extending the simulation to 100 ns reveals well-defined ridges corresponding to the boat saddle point and the highest-energy half-chair barriers.
          </p>
          
          <div className="overflow-x-auto text-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 font-semibold text-white">Conformational State</th>
                  <th className="py-3 font-semibold text-white">Topological Feature</th>
                  <th className="py-3 font-semibold text-emerald-400">Relative Free Energy (ΔG)</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {ENERGY_ROWS.map((row, i) => {
                  const isActive = activeConformation === row.key;
                  const color = CONFORMATIONS[row.key]?.color;
                  return (
                    <tr
                      key={row.key}
                      className={`transition-colors duration-300 ${i < ENERGY_ROWS.length - 1 ? "border-b" : ""} ${isActive ? "" : "border-white/5 hover:bg-white/5"}`}
                      style={isActive ? { borderColor: color + "30", background: color + "12" } : {}}
                    >
                      <td className="py-4 font-bold transition-colors duration-300" style={{ color: isActive ? color : "white" }}>
                        {isActive && <span className="inline-block w-1.5 h-1.5 rounded-full mr-2 mb-0.5" style={{ background: color }} />}
                        {row.label}
                      </td>
                      <td className="py-4">{row.feature}</td>
                      <td className="py-4 font-mono" style={{ color: isActive ? color : undefined }}>{row.energy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Boltzmann Calculator */}
      <section id="section-boltzmann" className="space-y-4">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-3xl font-bold">Boltzmann Factor Explorer</h2>
          <p className="text-muted-foreground mt-2">Adjust temperature and energy barrier to see how thermally accessible each conformation is.</p>
        </div>
        <BoltzmannCalculator />
      </section>

      {/* Interactive Energy-to-Structure Explorer */}
      <section id="section-explorer" className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
          <div>
            <h2 className="text-3xl font-bold">Interactive Explorer</h2>
            <p className="text-muted-foreground mt-2">
              Click a node on the energy surface to view the 3D conformation
              <span className={`ml-2 text-xs font-semibold px-2 py-0.5 rounded-full ${simLength === "20ns" ? "bg-orange-500/20 text-orange-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                {simLength.replace("ns", " ns")}
              </span>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {["chair", "twist_boat", "boat", "half_chair"].map((key) => (
              <button
                key={key}
                onClick={() => setActiveConformation(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  activeConformation === key
                    ? "bg-white/20 text-white scale-105 shadow-lg"
                    : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:scale-105"
                }`}
              >
                {key.replace("_", "-").replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 min-h-[500px]">
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
            <InteractiveEnergyMap
              activeConformation={activeConformation}
              onSelect={setActiveConformation}
              dataUrl={`/homework1/fes_3d_data_${simLength}.json`}
            />
          </div>
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
            <MolecularViewer activeConformation={activeConformation} />
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <section id="section-conclusions" className="space-y-6">
        <h2 className="text-3xl font-bold border-b border-white/10 pb-4">4. Conclusions</h2>
        <div className="glass-panel p-6 rounded-2xl space-y-4 text-muted-foreground leading-relaxed border border-white/10">
          <p>
            By elevating the simulation temperature from 300 K to 1000 K, the system was provided with sufficient thermal energy to overcome the high-energy half-chair barriers. This successfully prevented kinetic trapping, allowing the molecule to thoroughly explore its conformational phase space.
          </p>
          <p>
            However, this high-temperature methodology introduces physically unrealistic artifacts. Simulating at 1000 K implicitly relies on classical harmonic force fields to maintain structural integrity under extreme thermal stress. In reality, at such elevated temperatures, standard bonds are not strictly unbreakable, and the effects of quantum dynamics and potential bond dissociation become significant. To obtain a chemically accurate free energy surface at a biologically relevant 300 K without artificial heating, advanced enhanced sampling techniques (such as Umbrella Sampling or Metadynamics) should be utilized.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 pt-8 text-center text-sm text-muted-foreground pb-12 mt-12">
        <p>Built for MAT 306 — Computational Techniques for Materials at the Nano-scale.</p>
        <p className="mt-2">Author: Ahmet Ekiz | Interactive Report Converted by Agent</p>
      </footer>
    </main>
  );
}
