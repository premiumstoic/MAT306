import { Lightbulb, Beaker, Cpu, Atom } from "lucide-react";
import Latex from "./Latex";

export default function NextStepsSection() {
  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden mt-8 border border-white/10">
      {/* Decorative gradient background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-500/20 rounded-xl">
            <Lightbulb className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Beyond Classical Mechanics</h2>
            <p className="text-muted-foreground mt-1">What if we actually want to simulate butane burning at 1200K?</p>
          </div>
        </div>
        
        <p className="text-muted-foreground text-base mb-8 max-w-4xl leading-relaxed">
          Our NAMD simulation uses the <code className="text-xs bg-white/10 px-1 py-0.5 rounded text-foreground">par_all35_ethers-2.prm</code> classical force field. This treats atoms as balls connected by unbreakable springs governed by <Latex>{`$E = \\frac{1}{2}k(x-x_0)^2$`}</Latex>. If we pushed this to 1200K, the thermal energy would stretch the springs infinitely without breaking, simulating a physically impossible &quot;mutant&quot; molecule. 
          <br /><br />
          To truly simulate high-temperature thermal cracking (pyrolysis) where bonds shatter and methane/ethane gases are formed, the research world splits into two main camps:
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ReaxFF Card */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Beaker className="w-24 h-24" />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
                <Beaker className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="font-bold text-xl text-rose-100">1. ReaxFF (LAMMPS)</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              The workhorse for simulating large-scale destruction. Instead of permanent springs, ReaxFF uses the concept of <strong>&quot;bond order&quot;</strong>—calculating the distance between every atom on the fly. As butane atoms are ripped apart by heat, the bond order drops to zero, and the software officially severs the connection to create new molecules.
            </p>
            
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"/> Solves Newton&apos;s equations of motion, skipping heavy quantum mechanics.</li>
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"/> Trained against QM calculations to retain accurate reaction barriers.</li>
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"/> Heavier than classical mechanics—moving to a GPU is highly recommended using LAMMPS KOKKOS.</li>
            </ul>
          </div>

          {/* AIMD Card */}
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Atom className="w-24 h-24" />
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Atom className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="font-bold text-xl text-cyan-100">2. AIMD / QM</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              If ReaxFF is the practical approach, Ab Initio Molecular Dynamics (AIMD) is the absolute ground truth. It brings the electrons back into the picture, solving the Schrödinger equation at every single timestep to see exactly how the electron clouds shift and break.
            </p>

            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"/> The ultimate accuracy for observing the exact moment of bond fission.</li>
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"/> Due to the massive equation matrices, it can only be applied to very small systems.</li>
              <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"/> A GPU is mandatory (VASP, CP2K, TeraChem) to evaluate wavefunctions in a reasonable timeframe.</li>
            </ul>
          </div>
          
        </div>

        <div className="mt-6 bg-black/40 border border-white/5 rounded-xl p-5 flex items-start gap-4">
          <div className="p-2 bg-white/5 rounded-lg shrink-0 mt-1">
            <Cpu className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-semibold text-emerald-100 flex items-center gap-2 mb-1">
              Hardware Reality: i7-13700KF
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The 16-core i7-13700KF is an absolute powerhouse for the classical NAMD sweep mapped out here (150K to 600K). However, if one pivots to bond-breaking chemistry with AIMD or ReaxFF, pairing it with a strong NVIDIA GPU (like an RTX 40-series) would be essential to run dynamic neighbor lists and massive wave matrices without waiting decades for results.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
