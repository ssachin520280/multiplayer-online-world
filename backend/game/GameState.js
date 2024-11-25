const Level = require("./Level");

class GameState {
    constructor() {
        this.players = new Map();
        this.slimes = [];
        this.level = new Level();
        this.initializeSlimes();
    }

    initializeSlimes() {
        for (let i = 0; i < 10; i++) {
            this.slimes.push({
                id: i,
                x: Math.floor(Math.random() * 600) + 100,
                y: Math.floor(Math.random() * 400) + 100,
                velocityX: 0,
                velocityY: 0,
                changeTimer: 0,
                changeDelay: Math.floor(Math.random() * 2000) + 1000
            });
        }
    }

    addPlayer(socketId) {
        this.players.set(socketId, {
            x: 400,
            y: 300,
            animation: 'idle-down',
            flipX: false,
            input: {
                left: false,
                right: false,
                up: false,
                down: false,
                space: false
            }
        });
    }

    removePlayer(socketId) {
        this.players.delete(socketId);
    }

    updatePlayerInput(socketId, input) {
        const player = this.players.get(socketId);
        if (player) {
            player.input = input;
        }
    }

    update() {
        this.updatePlayers();
        this.updateSlimes();
        return this.getState();
    }

    updatePlayers() {
        for (const [socketId, player] of this.players.entries()) {
            let newX = player.x;
            let newY = player.y;
            const speed = 5;

            if (player.input.left) {
                newX -= speed;
                player.animation = 'walk-right';
                player.flipX = true;
            }
            else if (player.input.right) {
                newX += speed;
                player.animation = 'walk-right';
                player.flipX = false;
            }
            else if (player.input.up) {
                newY -= speed;
                player.animation = 'walk-up';
            }
            else if (player.input.down) {
                newY += speed;
                player.animation = 'walk-down';
            }
            else {
                if (player.animation.includes('walk-down')) {
                    player.animation = 'idle-down';
                }
                else if (player.animation.includes('walk-right')) {
                    player.animation = 'idle-right';
                }
                else if (player.animation.includes('walk-up')) {
                    player.animation = 'idle-up';
                }
            }

            // Check for collisions before updating position
            if (!this.level.isColliding(newX, newY)) {
                player.x = newX;
                player.y = newY;
            }

            if (player.input.space) {
                if (player.animation.includes('down')) {
                    player.animation = 'attack-down';
                }
                else if (player.animation.includes('right')) {
                    player.animation = 'attack-right';
                }
                else if (player.animation.includes('up')) {
                    player.animation = 'attack-up';
                }
            }
        }
    }

    updateSlimes() {
        this.slimes.forEach(slime => {
            slime.changeTimer += 16;
            if (slime.changeTimer >= slime.changeDelay) {
                slime.changeTimer = 0;
                slime.changeDelay = Math.floor(Math.random() * 2000) + 1000;

                const angle = Math.random() * 360;
                const speed = Math.random() * 100 + 50;
                slime.velocityX = speed * Math.cos(angle * Math.PI / 180);
                slime.velocityY = speed * Math.sin(angle * Math.PI / 180);
            }

            slime.x += slime.velocityX * 0.016;
            slime.y += slime.velocityY * 0.016;

            // Keep slimes in bounds
            slime.x = Math.max(100, Math.min(700, slime.x));
            slime.y = Math.max(100, Math.min(500, slime.y));
        });
    }

    getState() {
        return {
            players: Object.fromEntries(this.players),
            slimes: this.slimes
        };
    }
}

module.exports = GameState; 