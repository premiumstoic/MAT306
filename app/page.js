import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 xl:p-12 max-w-[1600px] mx-auto flex flex-col items-center justify-center space-y-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden h-full w-full">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <header className="text-center space-y-6 z-10 pt-16">
        <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 backdrop-blur-md">
          MAT 306 Course Hub
        </div>
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:via-white/80 dark:to-white/30 drop-shadow-sm pb-2">
          Computational Techniques
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed mx-auto">
          Explore interactive simulations and assignments for materials at the nano-scale.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl z-10 mt-12 pb-24">
        {/* Week 4 Card */}
        <Link href="/week4" className="group relative block p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 hover:border-primary/50 overflow-hidden transform hover:-translate-y-1 shadow-2xl hover:shadow-primary/20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex flex-col h-full space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold mb-2 shadow-inner border border-primary/20">
              W4
            </div>
            <h2 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">Week 4: Butane Dynamics</h2>
            <p className="text-muted-foreground text-lg flex-grow leading-relaxed">
              Explore how thermal energy drives conformational transitions across the central C-C-C-C dihedral angle. Data from a 100 ns NAMD simulation.
            </p>
            <div className="flex items-center text-primary font-semibold mt-6 group-hover:translate-x-3 transition-transform duration-300 text-lg">
              Explore Simulation <span className="ml-2">→</span>
            </div>
          </div>
        </Link>

        {/* Homework 1 Card */}
        <Link href="/hw1" className="group relative block p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300 hover:border-blue-500/50 overflow-hidden transform hover:-translate-y-1 shadow-2xl hover:shadow-blue-500/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex flex-col h-full space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold mb-2 shadow-inner border border-blue-500/20">
              H1
            </div>
            <h2 className="text-3xl font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Homework 1</h2>
            <p className="text-muted-foreground text-lg flex-grow leading-relaxed">
              Dive into the first homework assignment. Analyze simulation data and complete interactive modules designed for MAT 306.
            </p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold mt-6 group-hover:translate-x-3 transition-transform duration-300 text-lg">
              View Homework <span className="ml-2">→</span>
            </div>
          </div>
        </Link>
      </div>

      <footer className="absolute bottom-8 w-full text-center text-sm text-muted-foreground z-10 font-medium tracking-wide">
        <p>Built for MAT 306 — Author: Ahmet Ekiz</p>
      </footer>
    </main>
  );
}
