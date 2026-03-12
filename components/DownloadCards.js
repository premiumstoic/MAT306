import { Download, FileText, Database, Code2 } from "lucide-react";

export default function DownloadCards({ temp }) {
  const files = [
    {
      name: `butane_${temp}K_1e8.colvars.traj`,
      description: "Dihedral angle trajectory (100,000 steps)",
      icon: <Database className="w-5 h-5 text-emerald-400" />,
      url: `/raw_data/${temp}K/butane_${temp}K_1e8.colvars.traj`,
      size: "~3.8 MB"
    },
    {
      name: `butane_${temp}K_1e8.namd`,
      description: "NAMD config file used for this run",
      icon: <Code2 className="w-5 h-5 text-blue-400" />,
      url: `/raw_data/${temp}K/butane_${temp}K_1e8.namd`,
      size: "2 KB"
    },
    {
      name: `butane_${temp}K_1e8.log`,
      description: "NAMD standard output log (thermodynamics)",
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      url: `/raw_data/${temp}K/butane_${temp}K_1e8.log`,
      size: "~29 MB"
    },
    {
      name: "butane_dihedral.colvars",
      description: "Colvars definition file for C1-C2-C3-C4",
      icon: <Code2 className="w-5 h-5 text-purple-400" />,
      url: `/raw_data/${temp}K/butane_dihedral.colvars`,
      size: "1 KB"
    }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl md:col-span-12 lg:col-span-12 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Raw Data Downloads ({temp}K)
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Download the raw NAMD output files to build your own Python visualizations and Free Energy profiles.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {files.map((file, idx) => (
          <a
            key={idx}
            href={file.url}
            download
            className="group flex flex-col justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all hover:border-white/20 active:scale-95"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-black/30 w-fit">
                {file.icon}
              </div>
              <div className="overflow-hidden">
                <p className="font-mono text-sm text-foreground/90 truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {file.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
              <span className="text-xs font-mono text-muted-foreground">{file.size}</span>
              <span className="text-xs font-semibold text-primary group-hover:underline flex items-center gap-1">
                Download <Download className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
