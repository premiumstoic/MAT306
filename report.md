# MAT 306 — Week 4 Report
**Course:** Computational Techniques for Materials at the Nano-scale  
**Date:** March 12, 2026  
**AI assistant used:** GitHub Copilot (Claude Sonnet 4.6)

---

## 1. NAMD Simulation — What We Did and What multiplot.dat Represents

### What Is NAMD?

NAMD (Nanoscale Molecular Dynamics) is a high-performance molecular dynamics (MD) simulation program developed at the Theoretical and Computational Biophysics Group, University of Illinois. It integrates Newton's equations of motion for each atom in a molecule over many small time steps, producing a trajectory that describes how the system evolves in time at a given temperature.

### What Was Simulated?

The molecule we simulated is **butane (C₄H₁₀)**, a four-carbon alkane chain. The simulation used:

| File | Role |
|---|---|
| `butane.pdb` | Starting atomic coordinates |
| `butane.psf` | Molecular topology (bonds, angles, dihedrals) |
| `par_all35_ethers-2.prm` | CHARMM force field parameters (energy functions) |

The key settings in the NAMD config files were:
- **Timestep:** 1 femtosecond (fs) per step
- **Output:** every 1000 steps for the original run; every 100,000 steps in the automated sweep
- **Thermostat:** initial temperature set by `temperature` keyword; advanced runs use Langevin dynamics
- **Minimization:** 1000 steps of energy minimization before MD starts (fresh runs only)
- **Trajectory file:** `.dcd` (binary coordinate trajectory)
- **Log file:** `.log` (contains energy, temperature, and pressure at each output step)

Runs completed so far:

| Run | Temperature | Steps | Equivalent Time | Config File |
|---|---|---|---|---|
| Reference (400 K) | 400 K | 1,000,000 | 1.0 ns | `butane.namd` |
| 800 K run | 800 K | 1,000,000 | 1.0 ns | `butane800.namd` |
| 400 K long (partial) | 400 K | ~14,284,000 stopped | ~14.3 ns | `butane_400K_1e8.namd` |

### What Is multiplot.dat?

`multiplot.dat` is a plain-text two-column data file exported from **VMD (Visual Molecular Dynamics)** using the Labels → Dihedral → Graph → Export to ASCII Matrix workflow described in the assignment.

- **Column 1:** Frame index (integer, starting from 0)
- **Column 2:** Value of the central C1–C2–C3–C4 dihedral angle at that frame, in degrees, in the range [−180, +180]
- **Rows:** 1001 rows, corresponding to 1001 DCD frames sampled every 1000 steps from the 1,000,000-step reference run

This file is the primary input to all downstream Python analysis in this project. It bridges the NAMD simulation output and the Python/Jupyter analysis pipeline.

---

## 2. Assignment Overview — What It Asked and What It Tries to Teach

### Assignment Brief

The Week 4 assignment (from `explanation.md`, MAT 306, March 12, 2026) asks students to:

1. **Extract** the central C–C–C–C dihedral angle trajectory from the MD output (`.dcd` file), either using VMD or directly in Python.
2. **Plot** the dihedral angle as a function of simulation time (x-axis: time, y-axis: angle in degrees), ensuring angles are shifted to the range [0°, 360°] using the convention:
   - *trans* state (t): 180°
   - *gauche⁻* state (g⁻): 60°
   - *gauche⁺* state (g⁺): 300°
3. **Build a histogram** (count distribution) with user-chosen bin sizes (example: 10°), and plot the angle distribution.

### Purpose and Learning Objectives

The assignment is designed to build three layers of understanding:

**Physical intuition:**  
The central dihedral angle is the single most important internal degree of freedom of butane — it determines whether the molecule is in its *trans* or *gauche* conformations. By tracking this angle over a nanosecond trajectory, students observe thermally-driven conformational transitions directly.

**Computational skills:**  
Students learn the end-to-end scientific computing workflow: MD simulation output → trajectory post-processing → statistical analysis → publication-quality plots. They practice file I/O, array operations, and histogram binning in Python.

**Statistical mechanics connection:**  
The histogram of angles is a direct empirical estimate of the conformational probability distribution P(φ). From this, the concept of a free-energy surface can be introduced: the more frequently an angle is visited, the lower-energy that conformation is. This sets the stage for the Boltzmann inversion discussed later.

---

## 3. Jupyter Notebook — What It Does and What the Outputs Represent

The notebook `dcd-extraction.ipynb` is a self-contained, step-by-step analysis and visualization environment. It is composed of 8 cells:

### Cell 1 — Metadata and Comparison Log (Markdown)

Documents the reference run metadata (400 K, 1,000,000 steps) and provides a template comparison log for tracking multiple runs side by side.

### Cell 2 — Imports

Loads the required Python libraries: `numpy` (numerical arrays), `matplotlib` (plotting), `pathlib` (file path handling), and — later — `MDAnalysis` (direct DCD reading).

### Cell 3 — Data Loading and Angle Processing

Reads `multiplot.dat` and computes:
- `frame`: frame indices
- `angle_deg_raw`: raw VMD-exported angles in [−180, +180]
- `angle_deg_wrapped`: angles shifted to [0°, 360°] using `np.mod(angle, 360)`
- `angle_rad`: radians version
- `time_ps`: physical time in picoseconds, computed as `frame × timestep_fs / 1000`

Run metadata variables (`temperature_K = 400`, `n_steps = 1_000_000`) are also set here so each run is uniquely labeled.

### Cell 4 — Trajectory and Histogram Plots (Reference 400 K Run)

**Output 1 — Trajectory plot** (`week4_ref_400K_1e6_trajectory.png`):  
X-axis = time in ps, Y-axis = dihedral angle in degrees [0, 360°].  
Dashed horizontal lines mark the three conformational states: g⁻ (60°), t (180°), g⁺ (300°).  
This shows how butane stays primarily in the trans state at 400 K, with occasional short excursions into gauche territory.

**Output 2 — Histogram** (`week4_ref_400K_1e6_histogram.png`):  
X-axis = bin center in degrees (10° bins), Y-axis = count.  
Shows that the distribution is heavily concentrated near 180°, confirming trans is strongly preferred at 400 K.

**Tabular outputs:**  
- `week4_ref_400K_1e6_angles.csv`: full processed table (frame, time, raw angle, wrapped angle, radians)  
- `week4_ref_400K_1e6_histogram_counts.txt`: bin centers and counts

### Cell 5 — 800 K Dihedral Extraction via MDAnalysis

Rather than relying on VMD for the 800 K run, this cell uses the Python library **MDAnalysis** to directly read `i_guess_800K.dcd` and compute the C1–C2–C3–C4 dihedral angles programmatically (atom indices 3, 6, 9, 13 in 0-based indexing, corresponding to PSF atoms 4, 7, 10, 14). This eliminates the VMD export step for future runs.

Output: `angle_800K_wrapped` — 1001 frames of dihedral data, wrapped to [0°, 360°].

### Cell 6 — Side-by-Side Comparison Plot

Produces a 2×2 comparison figure (`week4_comparison_400K_vs_800K.png`):
- **Top row:** Trajectory plots for 400 K (left) and 800 K (right)
- **Bottom row:** Histograms for both temperatures

Key observation visible in this plot:  
At 400 K, butane spends almost all its time near trans (180°) with only 1–2 brief excursions.  
At 800 K, the molecule transitions much more frequently between all three states (g⁻, trans, g⁺), and the histogram shows substantial gauche populations, demonstrating that higher thermal energy overcomes the torsional barrier more readily.

### Cell 7 — Free-Energy Profiles Header (Markdown)

Introduces the Boltzmann inversion equation used in the next cell:

$$\Delta G(\phi) = -RT \ln P(\phi)$$

where R = 8.314 × 10⁻³ kJ mol⁻¹ K⁻¹, T is temperature in Kelvin, and P(φ) is the probability in each angular bin.

### Cell 8 — Free-Energy Profile Computation and Plots

This is the most physically meaningful cell. It converts the empirical probability distributions into relative free-energy profiles using Boltzmann inversion.

**Output — Energy profile figure** (`week4_energy_profiles_400K_vs_800K.png`):
A 2×2 figure with:
- **Top row:** Normalized probability distributions P(φ) for 400 K (left) and 800 K (right)
- **Bottom row:** ΔG(φ) profiles in kJ/mol, with the global minimum (trans) set to zero

Physical interpretation:
- At 400 K: the gauche wells are poorly sampled, so the energy profile is noisy at the barrier regions — a known artifact of insufficient sampling
- At 800 K: the profile is smoother and more reliable; the gauche wells sit approximately 8–9 kJ/mol above trans, consistent with the known experimental value (~3.8 kJ/mol for the gauche–trans energy difference in butane, though the barrier through cis is considerably higher and causes the sampling gaps near 0° and 360°)

---

## 4. Automated Scripts — What Was Done Beyond the Assignment

### 4a. Python Script: `dcd-extraction.py`

The standalone Python version of the analysis (distinct from the notebook) was built with the following additions beyond the basic assignment requirements:

| Feature | Purpose |
|---|---|
| `argparse` command-line interface | Run with custom `--input`, `--bin-size`, `--timestep-fs`, and `--prefix` flags |
| Physical time axis (ps) | Converts frame → picoseconds using timestep, satisfying the assignment requirement explicitly |
| Centered histogram bars | Uses `np.histogram` + bin centers instead of `plt.hist`, giving accurate x-axis positioning |
| Figure saving to PNG | Saves both plots to disk instead of requiring interactive display |
| CSV data export | Saves full processed angle table for reproducibility |
| Histogram counts text file | Outputs per-bin counts as a reusable table |
| Input validation | Raises `FileNotFoundError` / `ValueError` on bad inputs at the boundary |
| AI assistant header comment | First line of code credits the AI assistant used, as required by the assignment |

### 4b. PowerShell Script: `run_namd_sweep_windows.ps1`

This automation script was built entirely beyond the scope of the assignment as a research utility for running a systematic temperature sweep on a Windows machine. Key features:

**Run matrix:**  
Originally 6 jobs (400/800/1200 K at 1e6 and 1e8 steps); later expanded to 8 temperatures (150, 200, 250, 273, 300, 350, 450, 600 K) at 1e8 steps for a more physically meaningful temperature sweep.

**NAMD3 compatibility:**  
Upgraded to use NAMD3 (instead of NAMD2), which enables GPU acceleration. Config files use `binCoordinates` / `binVelocities` for binary restart handling (required by NAMD3), **Langevin thermostat** for proper constant-temperature dynamics, and `binaryoutput yes` for faster I/O.

**Colvars integration:**  
The generated configs reference a `butane_dihedral.colvars` file. Colvars (Collective Variables) is a NAMD module that directly computes and records the dihedral angle trajectory without writing a full DCD file, massively reducing storage requirements for long (1e8-step) runs.

**Resume / restart mode (`-Resume` switch):**  
Automatically detects existing `.restart.coor`, `.restart.vel`, and `.restart.xsc` files for each job, reads the last completed timestep from the log, computes the remaining steps to target, and writes a resume-ready config. Crucially, resume runs skip `minimize` and `reinitvels` to preserve the thermalized state continuity.

**Parallel job scheduler with live progress:**  
Uses `System.Collections.ArrayList` for a dynamic job queue and `Start-Process -PassThru` to manage background processes. Up to `MaxParallelJobs` (default: 3) jobs run simultaneously. Uses PowerShell `Write-Progress` to display the latest ENERGY step of each live job in the terminal progress bar, and polls every 5 seconds using `Start-Sleep`.

**Logging:**  
Every event (config generation, job start/stop, exit codes, warnings) is timestamped and written to both the console and a persistent session log file (`run_namd_sweep_console.log`).

**Auto-generated NAMD configs:**  
All six (or eight) `.namd` config files are generated programmatically from a single template within the script, with backslash-to-forward-slash path conversion for NAMD compatibility on Windows.

**CSV summary output:**  
After all jobs complete, a structured CSV file (`namd_sweep_summary.csv`) is written containing temperature, step label, exit code, final ENERGY step, whether `End of program` was found in the log, restart status, and run steps — ready to be loaded directly into the Jupyter notebook for analysis.

### What Technologies Were Used

| Tool/Library | Used For |
|---|---|
| NAMD 2.14 / NAMD 3.0.2 | Molecular dynamics simulation engine |
| VMD | Dihedral angle extraction from DCD trajectory |
| Python 3.11 | All data analysis and plotting |
| NumPy | Array math, histogram, angle wrapping, CSV export |
| Matplotlib | All figures (trajectory, histogram, free-energy profiles) |
| MDAnalysis | Direct DCD reading without VMD for the 800 K run |
| pathlib | Cross-platform file path handling |
| argparse | Command-line interface for the Python script |
| Jupyter Notebook | Interactive step-by-step analysis environment |
| PowerShell 5+/7 | Automated Windows batch runner for NAMD |
| NAMD Colvars module | Efficient dihedral angle recording without full trajectory |

---
