class Player {
    constructor() {
        this.position = { x: 0, y: 0, z: 0 }; // Initialize player position
        this.speed = 1; // Speed of movement
    }

    moveForward() {
        this.position.z += this.speed; // Move forward in the Z direction
    }

    moveBackward() {
        this.position.z -= this.speed; // Move backward in the Z direction
    }

    moveLeft() {
        this.position.x -= this.speed; // Move left in the X direction
    }

    moveRight() {
        this.position.x += this.speed; // Move right in the X direction
    }

    displayPosition() {
        console.log(`Player Position: X: ${this.position.x}, Y: ${this.position.y}, Z: ${this.position.z}`);
    }
}

// Example usage:
const player = new Player();
// Simulate movement
player.moveForward();
player.moveRight();
player.displayPosition();