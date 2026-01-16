// src/main.js

import Player from './Player.js';

const player = new Player();
const camera = { x: 0, y: 0}; // Camera object

// Keyboard input handling
const keys = {};
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});
document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

function updatePlayer() {
    // WASD movement
    if (keys['w']) {
        player.moveUp();
    }
    if (keys['a']) {
        player.moveLeft();
    }
    if (keys['s']) {
        player.moveDown();
    }
    if (keys['d']) {
        player.moveRight();
    }

    // Update camera position to follow player
    camera.x = player.x;
    camera.y = player.y;
}

function gameLoop() {
    updatePlayer();
    // Add rendering logic here, based on camera position and player state.
    requestAnimationFrame(gameLoop);
}

gameLoop();
