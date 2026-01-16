// Restore and update src/main.js with WASD keyboard input handling for player movement.

// Existing three.js scene setup code

let scene, camera, renderer, player;
// Setup scene, camera, lighting, ground, etc...

function init() {
    // Initialize the three.js scene
    // Setup camera
    // Setup lighting
    // Setup ground
    // Create player object
    player = new THREE.Object3D(); // Assuming player is an Object3D
    scene.add(player);

    // Add mouse controls and camera rotation
    // Animation loop
    animate();
}

let keyState = {};

// Track key states
document.addEventListener('keydown', (event) => {
    keyState[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keyState[event.key] = false;
});

function updatePlayerMovement() {
    const speed = 0.1; // Adjust speed as necessary

    if (keyState['w']) {
        player.position.z -= speed;
    }
    if (keyState['s']) {
        player.position.z += speed;
    }
    if (keyState['a']) {
        player.position.x -= speed;
    }
    if (keyState['d']) {
        player.position.x += speed;
    }
}

function animate() {
    requestAnimationFrame(animate);

    // Update player movement
    updatePlayerMovement();

    // Render scene
    renderer.render(scene, camera);
}

init();
