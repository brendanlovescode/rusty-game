import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';
import { World } from './world.js';
import { Player } from './player.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// lights
const amb = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(amb);
const sun = new THREE.DirectionalLight(0xffffff, 0.8);
sun.position.set(5, 10, 2);
sun.castShadow = true;
scene.add(sun);

// world
const world = new World(scene);
world.generateFlat({ size: 17 });

// player
const player = new Player(scene, camera, world);
player.setPosition(new THREE.Vector3(0, 2.2, 0));

// info UI
const info = document.getElementById('info');
function updateInfo() {
  info.textContent = `Pos: ${player.position.x.toFixed(1)}, ${player.position.y.toFixed(1)}, ${player.position.z.toFixed(1)}`;
}
updateInfo();

// input for block interactions (raycast from camera center)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function getCenterRay() {
  mouse.x = 0; mouse.y = 0; // center of screen
  raycaster.setFromCamera(mouse, camera);
  return raycaster;
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// mouse interactions: left -> remove, right -> place
window.addEventListener('mousedown', (e) => {
  // prevent context menu on right click
  if (e.button === 2) e.preventDefault();

  const rc = getCenterRay();
  const intersects = rc.intersectObjects(world.getBlockMeshes(), false);
  if (intersects.length === 0) return;
  const hit = intersects[0];
  const pos = hit.object.userData.position; // {x,y,z}
  const face = hit.face.normal; // THREE.Vector3
  if (e.button === 0) {
    // left click - remove block (but do not remove ground at y=0)
    if (pos.y > 0) world.removeBlock(pos.x, pos.y, pos.z);
  } else if (e.button === 2) {
    // right click - place block adjacent to hit face
    const nx = pos.x + Math.round(face.x);
    const ny = pos.y + Math.round(face.y);
    const nz = pos.z + Math.round(face.z);
    // don't place below ground
    if (ny >= 1 && !world.hasBlock(nx, ny, nz)) {
      world.addBlock(nx, ny, nz);
    }
  }
});

// keyboard: R to reset
window.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'r') {
    world.clear();
    world.generateFlat({ size: 17 });
    player.setPosition(new THREE.Vector3(0, 2.2, 0));
  }
});

let last = performance.now();
function animate(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  player.update(dt);
  updateInfo();

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// avoid context menu on canvas
window.addEventListener('contextmenu', (e) => e.preventDefault());

console.log('Blocky Adventure loaded');