class Player {
    constructor(name) {
        this.name = name;
        this.position = { x: 0, y: 0, z: 0 }; // XYZ coordinates
        this.speed = 1; // Movement speed
    }

    move(direction) {
        switch (direction) {
            case 'w': // move forward
                this.position.z += this.speed;
                break;
            case 's': // move backward
                this.position.z -= this.speed;
                break;
            case 'a': // move left
                this.position.x -= this.speed;
                break;
            case 'd': // move right
                this.position.x += this.speed;
                break;
            default:
                console.log('Invalid direction. Use w, a, s, d.');
        }
    }

    getPosition() {
        return this.position;
    }
}

// Event listener for key presses
window.addEventListener('keydown', (event) => {
    const player = new Player('Hero');
    player.move(event.key);
    console.log(`Player position: ${JSON.stringify(player.getPosition())}`);
});