# rusty-game

A simple, beginner-friendly three.js demo for a tiny RTS-like experience.

How to run (quick):
- Clone the repo and open `index.html` in a modern browser (Chrome/Edge/Firefox).
  - Note: some browsers restrict module imports when opening a file:// URL. If behavior is odd, run a local server.

How to run (recommended):
- Start a tiny HTTP server from the project root:
  - Python 3: `python -m http.server 8000`
  - Node (if you have http-server): `npx http-server -c-1`
- Open http://localhost:8000 in your browser.

Controls:
- Left-click on a unit to select it.
- Right-click (or Ctrl/Cmd+click) on the ground to order the selected unit to move to that location.
- Drag with the mouse (click + drag the background) to rotate the camera a little.

Files added:
- `index.html` — entry page
- `src/main.js` — scene, input and main loop
- `src/unit.js` — simple Unit class with move behavior
- `styles.css` — UI styling

Next steps / ideas:
- Add pathfinding (A* on a grid) for obstacle avoidance.
- Add more unit types, basic enemy AI, and basic resource gathering.
- Add selection box (click-and-drag) to select multiple units.
- Use a build tool (npm + bundler) for a larger project and to install three.js as a dependency.
- If you'd prefer Rust-native game development, check out Bevy (Rust game engine) — I can help set up a Bevy project instead.
