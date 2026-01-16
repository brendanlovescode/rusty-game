// Importing three.js
import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
dconst light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 0).normalize();
scene.add(light);

// Ground
const geometry = new THREE.PlaneGeometry(100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
const ground = new THREE.Mesh(geometry, material);
ground.rotation.x = - Math.PI / 2;
scene.add(ground);

// Units array
let units = [];

// Selection logic
dfunction selectUnit(unit) {
    // Logic for selecting a unit
}

// Player class
dclass Player {
    constructor() {
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        scene.add(this.mesh);
        this.speed = 0.1;
        this.setupControls();
    }

    setupControls() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'w':
                    this.mesh.position.z -= this.speed;
                    break;
                case 's':
                    this.mesh.position.z += this.speed;
                    break;
                case 'a':
                    this.mesh.position.x -= this.speed;
                    break;
                case 'd':
                    this.mesh.position.x += this.speed;
                    break;
            }
        });
    }
}

// Create a player instance
const player = new Player();

// Camera control
camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();