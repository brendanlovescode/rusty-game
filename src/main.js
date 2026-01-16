import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';
import { Unit } from './unit.js';

const canvasContainer = document.body;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1ff);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 40);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lights
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.8);
hemi.position.set(0, 50, 0);
scene.add(hemi);

const dir = new THREE.DirectionalLight(0xffffff, 0.8);
dir.position.set(-10, 30, 10);
dir.castShadow = true;
scene.add(dir);

// Ground (grid + plane for clicks)
const grid = new THREE.GridHelper(200, 40, 0x444444, 0x888888);
scene.add(grid);

const groundMat = new THREE.MeshStandardMaterial({ color: 0x88cc88 });
const groundGeo = new THREE.PlaneGeometry(200, 200);
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
ground.name = "ground";
scene.add(ground);

// Units array
const units = [];
const unitGroup = new THREE.Group();
scene.add(unitGroup);

// create a few sample units
for (let i = 0; i < 5; i++) {
  const x = (i - 2) * 6;
  const z = -5 + (i % 2) * 4;
  const unit = new Unit(new THREE.Vector3(x, 0, z), { color: i === 0 ? 0xff5555 : 0x3366ff });
  unitGroup.add(unit.mesh);
  units.push(unit);
}

// selection state
let selectedUnit = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const info = document.getElementById('info');

function updateInfo() {
  if (!selectedUnit) {
    info.textContent = 'No unit selected';
  } else {
    info.textContent = `Selected unit at (${selectedUnit.mesh.position.x.toFixed(1)}, ${selectedUnit.mesh.position.z.toFixed(1)})`;
  }
}
updateInfo();

// input handling
function getMouseCoords(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// left click selects a unit
window.addEventListener('click', (e) => {
  // Ctrl/Cmd + click we treat as right-click for convenience
  if (e.ctrlKey || e.metaKey) return;
  getMouseCoords(e);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(units.map(u => u.mesh), true);
  if (intersects.length > 0) {
    const mesh = intersects[0].object;
    selectedUnit = units.find(u => u.mesh === mesh || u.mesh.children.includes(mesh));
    units.forEach(u => u.setSelected(u === selectedUnit));
  } else {
    // click on empty space clears selection
    selectedUnit = null;
    units.forEach(u => u.setSelected(false));
  }
  updateInfo();
});

// right click (contextmenu) issues move order
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  getMouseCoords(e);
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(ground, true);
  if (hits.length > 0 && selectedUnit) {
    const point = hits[0].point;
    selectedUnit.moveTo(point);
  }
});

// convenience: also accept Ctrl+click as move target
window.addEventListener('click', (e) => {
  if (!(e.ctrlKey || e.metaKey)) return;
  getMouseCoords(e);
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(ground, true);
  if (hits.length > 0 && selectedUnit) {
    const point = hits[0].point;
    selectedUnit.moveTo(point);
  }
});

let last = performance.now();
function animate(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  units.forEach(u => u.update(dt));

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// simple orbit-controls-like mouse drag to rotate camera (very small custom impl)
let isDragging = false;
let startX = 0;
let startY = 0;
window.addEventListener('mousedown', (e) => {
  // do not start drag when clicking UI elements
  if ((e.target && e.target.closest && e.target.closest('#ui'))) return;
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
});
window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = (e.clientX - startX) * 0.005;
  const dy = (e.clientY - startY) * 0.005;
  startX = e.clientX;
  startY = e.clientY;
  // rotate camera around scene center
  const radius = camera.position.length();
  const spherical = new THREE.Spherical().setFromVector3(camera.position);
  spherical.theta -= dx;
  spherical.phi = Math.max(0.3, Math.min(Math.PI / 2 - 0.1, spherical.phi - dy));
  camera.position.setFromSpherical(spherical);
  camera.lookAt(0, 0, 0);
});
window.addEventListener('mouseup', () => isDragging = false);
