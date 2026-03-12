import Dashboard from "@/components/Dashboard";
import AutomationSection from "@/components/AutomationSection";
import NextStepsSection from "@/components/NextStepsSection";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 xl:p-12 max-w-[1600px] mx-auto space-y-12">
      <header className="space-y-6">
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
          Interactive Simulation Data
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent">
          Butane Dynamics
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl leading-relaxed">
          Explore how thermal energy drives conformational transitions across the central C-C-C-C dihedral angle.
          Data generated from a 100 ns NAMD simulation.
        </p>
      </header>

      <Dashboard />

      <AutomationSection />
      <NextStepsSection />

      <footer className="border-t border-white/10 pt-8 text-center text-sm text-muted-foreground pb-12 mt-12">
        <p>Built for MAT 306 — Computational Techniques for Materials at the Nano-scale.</p>
        <p className="mt-2">Author: Ahmet Ekiz | Simulation Engine: NAMD3 | AI Used: Claude 🫱🏻🫲🏿 Gemini 🫱🏻🫲🏿 GPT</p>
      </footer>
    </main>
  );
}
