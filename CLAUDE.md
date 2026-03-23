# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

No test framework is configured — this is an educational demo project.

## Architecture

**Stack**: Next.js 16 (App Router) + React 19 + TailwindCSS v4, no testing setup.

### Routes

| Route | Purpose |
|-------|---------|
| `/` | Home/course hub landing page |
| `/week4` | Butane molecular dynamics interactive dashboard |
| `/hw1` | Homework 1: Cyclohexane conformational analysis |

### Key Architectural Patterns

**Plotly must be dynamically imported** to avoid SSR errors:
```js
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
```
This pattern is used in `InteractiveEnergyMap.js` and `SurfacePlot.js`.

**3DMol** (`MolecularViewer.js`) is initialized imperatively via `useEffect` after the DOM mounts, not declaratively.

**Data flow for Week 4**: `Dashboard.js` fetches `/data/butane_${temp}K.json` on temperature change and distributes data to `EnergyChart` and `TrajectoryChart`. Available temperatures are listed in `/public/data/temperatures.json`.

**Data flow for HW1**: `ReactionCoordinateChart` drives the selected conformation index; `MolecularViewer` loads the corresponding PDB from `/public/homework1/`; `InteractiveEnergyMap` reads a single large JSON (`fes_3d_data_100ns.json`) for the 3D free energy surface.

### Styling

TailwindCSS v4 with dark mode forced via `dark` class on `<html>` (set in `app/layout.js`). Custom color variables and a `.glass-panel` utility class are defined in `app/globals.css`. Primary accent color is emerald-500.

### Path Aliases

`@/` maps to the project root (defined in `jsconfig.json`), so imports like `@/components/Latex` resolve correctly.

### Data Files

- `/data/` — JSON simulation trajectories per temperature (150K–600K), loaded client-side
- `/public/homework1/` — PDB molecular structure files + 3D FES JSON
- `/public/raw_data/` — Original simulation output files
