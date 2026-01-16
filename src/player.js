import * as THREE from 'https://unpkg.com/three@latest/build/three.module.js';

export class Player {
  constructor(scene, camera, world) {
    this.scene = scene;
    this.camera = camera;
    this.world = world;

    this.speed = 5.0; // units per second
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.yaw = 0; // rotation around Y

    // build simple blocky player: body + head
    const bodyGeo = new THREE.BoxGeometry(0.8, 1.2, 0.4);
    const headGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const matBody = new THREE.MeshStandardMaterial({ color: 0x4433ff });
    const matHead = new THREE.MeshStandardMaterial({ color: 0xffcc99 });

    this.body = new THREE.Mesh(bodyGeo, matBody);
    this.body.position.y = 1.0;
    this.head = new THREE.Mesh(headGeo, matHead);
    this.head.position.y = 1.8;

    this.group = new THREE.Group();
    this.group.add(this.body);
    this.group.add(this.head);
    this.group.position.copy(this.position);
    this.scene.add(this.group);

    // camera offset (third-person)
    this.camOffset = new THREE.Vector3(0, 2.0, 5.0);

    // input state
    this.input = { forward: false, back: false, left: false, right: false };
    this._setupInput();
  }

  setPosition(v) {
    this.position.copy(v);
    this.group.position.copy(this.position);
  }

  _setupInput() {
    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w') this.input.forward = true;
      if (k === 's') this.input.back = true;
      if (k === 'a') this.input.left = true;
      if (k === 'd') this.input.right = true;
    });
    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w') this.input.forward = false;
      if (k === 's') this.input.back = false;
      if (k === 'a') this.input.left = false;
      if (k === 'd') this.input.right = false;
    });

    // rotate player with right mouse drag
    let isRotating = false;
    let lastX = 0;
    window.addEventListener('mousedown', (e) => {
      if (e.button === 2) {
        isRotating = true;
        lastX = e.clientX;
      }
    });
    window.addEventListener('mouseup', (e) => {
      if (e.button === 2) isRotating = false;
    });
    window.addEventListener('mousemove', (e) => {
      if (!isRotating) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      this.yaw -= dx * 0.005;
    });
  }

  update(dt) {
    // compute direction from input and yaw
    const dir = new THREE.Vector3();
    if (this.input.forward) dir.z -= 1;
    if (this.input.back) dir.z += 1;
    if (this.input.left) dir.x -= 1;
    if (this.input.right) dir.x += 1;
    if (dir.lengthSq() > 0) dir.normalize();

    // rotate direction by yaw
    const sin = Math.sin(this.yaw);
    const cos = Math.cos(this.yaw);
    const move = new THREE.Vector3(
      dir.x * cos - dir.z * sin,
      0,
      dir.x * sin + dir.z * cos
    );

    // simple collision: check target position not inside a block
    const next = this.position.clone().addScaledVector(move, this.speed * dt);
    const foot = new THREE.Vector3(Math.round(next.x), Math.round(next.y), Math.round(next.z));

    // sample four corners to avoid entering blocks
    const collide = (x, y, z) => this.world.hasBlock(Math.round(x), Math.round(y), Math.round(z));
    const checkX = Math.round(next.x);
    const checkZ = Math.round(next.z);
    // only prevent movement if there's a block at player's ground level (y = 1)
    if (this.world.hasBlock(checkX, 1, checkZ)) {
      // stop movement
    } else {
      this.position.copy(next);
    }

    // update group and camera
    this.group.position.copy(this.position);
    this.group.rotation.y = this.yaw;

    // camera follows behind the player
    const offset = this.camOffset.clone();
    // rotate offset by yaw
    const rotatedOffset = new THREE.Vector3(
      offset.x * Math.cos(this.yaw) - offset.z * Math.sin(this.yaw),
      offset.y,
      offset.x * Math.sin(this.yaw) + offset.z * Math.cos(this.yaw)
    );
    const camPos = this.position.clone().add(rotatedOffset);
    this.camera.position.copy(camPos);
    this.camera.lookAt(this.position.x, this.position.y + 1.2, this.position.z);
  }
}