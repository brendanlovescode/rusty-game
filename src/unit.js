import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';

export class Unit {
  constructor(position = new THREE.Vector3(), opts = {}) {
    this.speed = opts.speed || 6; // units per second
    this.color = opts.color || 0x3366ff;
    this.selected = false;

    const bodyGeo = new THREE.CylinderGeometry(0.7, 0.9, 1.6, 12);
    const bodyMat = new THREE.MeshStandardMaterial({ color: this.color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;

    const markerGeo = new THREE.CircleGeometry(1.2, 20);
    markerGeo.rotateX(-Math.PI / 2);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.position.y = 0.01;

    this.mesh = new THREE.Group();
    this.mesh.add(body);
    this.mesh.add(marker);

    this.mesh.position.copy(position);
    this._target = null;
    this._marker = marker;
    this._body = body;
  }

  setSelected(on) {
    this.selected = on;
    this._body.material.emissive = on ? new THREE.Color(0x333333) : new THREE.Color(0x000000);
    this._marker.material.opacity = on ? 0.5 : 0.25;
  }

  moveTo(point) {
    this._target = new THREE.Vector3(point.x, 0, point.z);
  }

  update(dt) {
    if (!this._target) return;
    const pos = this.mesh.position;
    const dir = new THREE.Vector3().subVectors(this._target, pos);
    const dist = dir.length();
    if (dist < 0.1) {
      this._target = null;
      return;
    }
    dir.normalize();
    const move = Math.min(this.speed * dt, dist);
    pos.addScaledVector(dir, move);
    // rotate body to face movement
    const angle = Math.atan2(dir.x, dir.z);
    this.mesh.rotation.y = angle;
  }
}
