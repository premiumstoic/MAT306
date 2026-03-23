import { Terminal, Zap, Layers, Activity } from "lucide-react";
import CodeDisplay from "./CodeDisplay";
import Latex from "./Latex";

export default function AutomationSection() {
  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden mt-8">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <Terminal className="w-8 h-8 text-primary" />
          Simulation Automation & Parallelization
        </h2>
        
        <p className="text-muted-foreground text-lg mb-8 max-w-4xl">
          Running a 100 ns nanosecond simulation across 8 different temperatures (150K to 600K) is computationally expensive.
          To achieve this, we built a custom PowerShell suite (<code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded">run_namd_sweep_parallel.ps1</code>) that drastically optimizes the total wall-clock time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl p-5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Dynamic Job Queue</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We used PowerShell's <code className="text-xs text-foreground bg-black/10 dark:bg-black/30 px-1 py-0.5 rounded">System.Collections.ArrayList</code> to maintain a queue of pending NAMD jobs. The script uses <code className="text-xs text-foreground bg-black/10 dark:bg-black/30 px-1 py-0.5 rounded">Start-Process</code> to launch simulations in the background, keeping track of exactly 
              <code className="text-xs text-foreground bg-black/30 px-1 py-0.5 rounded ml-1">MaxParallelJobs</code> running concurrently to maximize CPU utilization without thrashing.
            </p>
          </div>

          <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl p-5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">CPU vs. GPU I/O Bottlenecks</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We upgraded to NAMD 3.0.2, but intentionally used the <strong>CPU-only</strong> multicore version. For a tiny molecule like butane, GPU computation is incredibly fast (20k steps in ~2s), but data writing becomes a severe I/O bottleneck (taking ~6 mins). 
              The 2-core CPU version finishes 1e6 steps in just ~45s, proving far superior for this scale!
            </p>
          </div>

          <div className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl p-5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
              <Activity className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Colvars Optimization</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Writing a full atom trajectory (.dcd) for an <Latex>$10^8$</Latex> step run would require gigabytes of storage per temperature. 
              Instead, we used the NAMD Collective Variables (Colvars) module to compute and output <i>only</i> the C1-C2-C3-C4 dihedral angle at every 1000th step, slashing data size to just 3.8 MB.
            </p>
          </div>
        </div>
        
        <CodeDisplay />
        
      </div>
    </div>
  );
}
