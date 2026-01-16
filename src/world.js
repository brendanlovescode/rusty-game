import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';

export class World {
  constructor(scene) {
    this.scene = scene;
    this.blocks = new Map(); // key -> mesh
    this.blockMeshes = [];

    // base material for blocks (voxel look)
    this.materials = {
      dirt: new THREE.MeshStandardMaterial({ color: 0x8B5A2B }),
      grass: new THREE.MeshStandardMaterial({ color: 0x56A13D }),
      stone: new THREE.MeshStandardMaterial({ color: 0x888888 })
    };

    this.geom = new THREE.BoxGeometry(1, 1, 1);
  }

  key(x, y, z) { return `${x},${y},${z}`; }

  addBlock(x, y, z, type = 'dirt') {
    const k = this.key(x, y, z);
    if (this.blocks.has(k)) return;
    const mat = (y === 0) ? this.materials.grass : this.materials.dirt;
    const mesh = new THREE.Mesh(this.geom, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.position = { x, y, z };
    this.scene.add(mesh);
    this.blocks.set(k, mesh);
    this.blockMeshes.push(mesh);
  }

  removeBlock(x, y, z) {
    const k = this.key(x, y, z);
    const mesh = this.blocks.get(k);
    if (!mesh) return;
    this.scene.remove(mesh);
    this.blocks.delete(k);
    const i = this.blockMeshes.indexOf(mesh);
    if (i >= 0) this.blockMeshes.splice(i, 1);
  }

  hasBlock(x, y, z) {
    return this.blocks.has(this.key(x, y, z));
  }

  getBlockMeshes() { return this.blockMeshes; }

  clear() {
    for (const mesh of Array.from(this.blockMeshes)) {
      this.scene.remove(mesh);
    }
    this.blocks.clear();
    this.blockMeshes = [];
  }

  generateFlat({ size = 17 } = {}) {
    const half = Math.floor(size / 2);
    for (let x = -half; x <= half; x++) {
      for (let z = -half; z <= half; z++) {
        this.addBlock(x, 0, z, 'grass');
        // random little hills
        if (Math.random() < 0.08) {
          this.addBlock(x, 1, z, 'dirt');
          if (Math.random() < 0.25) this.addBlock(x, 2, z, 'dirt');
        }
      }
    }
  }
}