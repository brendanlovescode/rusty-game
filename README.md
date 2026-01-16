# rusty-game - Blocky Adventure

This version turns the demo into a blocky, Minecraft-like style with a simple controllable character and a voxel world.

How to run (recommended):
- Serve the project from the repository root with a tiny HTTP server:
  - Python 3: `python -m http.server 8000`
  - Then open http://localhost:8000 in your browser.

Controls:
- WASD to move
- Hold right mouse button + move mouse to rotate player/camera
- Left-click (center crosshair) a block to remove it (won't remove ground layer)
- Right-click a block face to place a block adjacent to it
- Press R to reset world

Files added/updated:
- `index.html`
- `src/main.js`
- `src/world.js`
- `src/player.js`
- `styles.css`

Notes:
- This is a simple, educational demo. It does not implement advanced features like physics, pathfinding, or chunked world streaming.
- If you want, I can add jumping, block breaking animations, or a simple inventory system next.
