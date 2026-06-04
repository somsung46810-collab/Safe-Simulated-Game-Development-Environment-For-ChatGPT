# Safe Simulation Development Notes

This folder documents the safe simulated game development environment.

## Runtime Layers

1. Map Layer: blue wireframe scene shell and terrain grid.
2. Asset Layer: modular props, models, and animation targets.
3. Safety Layer: red solid cube bounds for collision and spawn validation.
4. Transform Layer: green dashed checkpoint cubes for rotation and rollback states.
5. Render Layer: MVP to clip-space projection into a safe render output.

## CI/CD Flow

The workflow installs dependencies, runs safety checks, builds the Vite browser simulation, creates a ZIP package, and uploads it as a GitHub Actions artifact.

## Safety Direction

This project is a non-destructive sandbox. It is intended for visual prototyping, debugging overlays, and controlled simulation of game development systems.
