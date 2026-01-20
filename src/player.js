class Player {
    constructor(position, speed) {
         // x, y, z coordinates
        this.position = position;
        this.speed = speed;
        // Camera follows the player from above and behind
        this.cameraOffset = { x: 0, y: 5, z: -10 };
    }

    move(input) {
        // input should be an object with keys: WASD
        if (input.W) {
            this.position.y += this.speed; // Move forward
        }
        if (input.S) {
            this.position.y -= this.speed; // Move backward
        }
        if (input.A) {
            this.position.x -= this.speed; // Move left
        }
        if (input.D) {
            this.position.x += this.speed; // Move right
        }
    }

    followCamera(camera) {
        // Set camera position based on player's position
        camera.position.x = this.position.x + this.cameraOffset.x;
        camera.position.y = this.position.y + this.cameraOffset.y;
        camera.position.z = this.position.z + this.cameraOffset.z;
        camera.lookAt(this.position.x, this.position.y, this.position.z);
    }

    getAppearance() {
        // Return appearance property, can be further developed
        return 'blocky'; // Reserved for Rust styling
    }
}

// Export the Player class
export default Player;
