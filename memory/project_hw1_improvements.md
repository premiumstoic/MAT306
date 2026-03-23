---
name: HW1 Improvement Backlog
description: Ordered list of planned improvements to the Homework 1 cyclohexane conformational analysis page
type: project
---

Backlog of HW1 improvements agreed on 2026-03-24, to be tackled one by one.

**Why:** Page has bugs (disconnected state), missing pedagogy (Boltzmann, 2D contour), and UX gaps (no spin toggle, no φ coordinates shown).
**How to apply:** Work through items in order below, marking done as completed.

## Queue

- [ ] 1. **Sync state** — Pass `onSelect` into `ReactionCoordinateChart`; lift `activeConformation` to `page.js` so chart selection drives the Interactive Explorer's molecular viewer and 3D FES. Remove redundant tiny embedded viewer from chart sidebar.
- [ ] 2. **Show φ₁/φ₂ in MolecularViewer info bar** — Add (φ₁, φ₂) coordinates for each conformation to the `CONFORMATIONS` map and display them in the top info bar.
- [ ] 3. **Spin pause/resume toggle** — Add a button to MolecularViewer that calls `viewer.spin()` / `viewer.stopAnimation()`.
- [ ] 4. **Highlight energy table row on conformation select** — Pass `activeConformation` into the energy table in Section 3 and apply a highlight style to the matching row.
- [ ] 5. **Playback speed control** — Add slow/normal/fast toggle to ReactionCoordinateChart that changes the setInterval delay (2000 / 1200 / 600 ms).
- [ ] 6. **2D contour view toggle** — Add a "3D / 2D" toggle to `SurfacePlot` and `InteractiveEnergyMap` that switches between `type: "surface"` and `type: "contour"` (heatmap with iso-lines).
- [ ] 7. **Extend 20ns/100ns toggle to Interactive Explorer** — Pass `simLength` from `page.js` into `InteractiveEnergyMap` so the explorer FES reflects whichever simulation length is selected.
- [ ] 8. **Boltzmann calculator widget** — New inline section with a temperature slider (300–1500 K) that computes and displays P ∝ e^{-ΔE/RT} for each barrier (chair→twist-boat at 5.5, chair→half-chair at 10.5 kcal/mol), with a note on why 1000 K is used.
