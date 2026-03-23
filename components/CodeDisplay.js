"use client";

import { FileType, Download } from "lucide-react";

export default function CodeDisplay() {

  const codeString = `param(
    [string]$NamdExe = "C:\\Users\\student\\mat306\\NAMD_3.0.2_Win64-multicore\\namd3.exe",
    [int]$Cores = 2,
    [int]$MaxParallelJobs = 8,
    [ValidateSet("all", "1e6", "1e8")]
    [string]$RunSet = "all",
    [switch]$Resume,
    [string]$SummaryCsv = "namd_sweep_summary.csv",
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ... Setup directories and logging ...

function New-NamdConfig {
    # Dynamically generates a .namd config file for the given temperature and step count
    # Implements seamless resume functionality using NAMD3 binary restart files
}

function Start-NamdJob {
    # Launches namd3.exe in the background
    # Redirects stdout/stderr to log files
}

# Define the temperature sweep matrix
$jobsSpec = @(
    @{ TemperatureK = 150; Steps = 100000000; StepLabel = "1e8" },
    @{ TemperatureK = 200; Steps = 100000000; StepLabel = "1e8" },
    @{ TemperatureK = 250; Steps = 100000000; StepLabel = "1e8" },
    @{ TemperatureK = 273; Steps = 100000000; StepLabel = "1e8" },
    @{ TemperatureK = 300; Steps = 100000000; StepLabel = "1e8" },
    @{ TemperatureK = 350; Steps = 100000000; StepLabel = "1e8" },
    @{ TemperatureK = 450; Steps = 100000000; StepLabel = "1e8" },
    @{ TemperatureK = 600; Steps = 100000000; StepLabel = "1e8" }
)

# Initialize dynamic job queue
$pendingJobs = New-Object System.Collections.ArrayList
foreach ($job in $selectedJobs) {
    [void]$pendingJobs.Add($job)
}
$runningJobs = New-Object System.Collections.ArrayList

# Main Parallel Control Loop
while (($pendingJobs.Count -gt 0) -or ($runningJobs.Count -gt 0)) {
    # Fill the queue up to MaxParallelJobs
    while (($pendingJobs.Count -gt 0) -and ($runningJobs.Count -lt $MaxParallelJobs)) {
        $job = $pendingJobs[0]
        $pendingJobs.RemoveAt(0)
        
        $p = Start-NamdJob -Job $job -ExePath $NamdExe -CoreCount $Cores
        
        [void]$runningJobs.Add([PSCustomObject]@{
            Job = $job
            Process = $p
        })
    }

    # Monitor running processes and live-parse the ENERGY step from logs
    for ($i = $runningJobs.Count - 1; $i -ge 0; $i--) {
        $entry = $runningJobs[$i]
        $entry.Process.Refresh()

        $currentEnergyStep = Read-FinalEnergyStep -LogPath $entry.Job.LogPath
        Write-Progress -Activity ("NAMD {0}K {1}" -f $entry.Job.TemperatureK, $entry.Job.StepLabel) -Status ("Latest ENERGY step: {0}" -f $currentEnergyStep)

        if ($entry.Process.HasExited) {
            $runningJobs.RemoveAt($i)
        }
    }

    if ($runningJobs.Count -gt 0) {
        Start-Sleep -Seconds 5
    }
}`;

  return (
    <div className="glass-panel p-6 md:p-8 rounded-2xl relative mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <FileType className="w-5 h-5 text-indigo-400" />
          run_namd_sweep_parallel.ps1 (Abridged)
        </h3>
        <a 
          href="/run_namd_sweep_parallel.ps1"
          download
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-xs font-medium text-primary-foreground shadow shadow-primary/20 transition-all hover:scale-105"
        >
          <Download className="w-3.5 h-3.5" />
          Download full script
        </a>
      </div>

      <div className="bg-slate-900 dark:bg-black/80 border border-black/10 dark:border-white/10 rounded-xl overflow-hidden">
        <div className="flex bg-white/5 px-4 py-2 border-b border-black/10 dark:border-white/10 text-xs font-mono text-muted-foreground">
          <div className="flex gap-1.5 items-center mr-4">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
          </div>
          PowerShell script
        </div>
        <pre className="p-4 text-xs md:text-sm font-mono text-emerald-300 dark:text-emerald-100/90 overflow-x-auto leading-relaxed">
          <code>{codeString}</code>
        </pre>
      </div>
    </div>
  );
}
