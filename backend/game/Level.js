const fs = require('fs');
const path = require('path');

class Level {
    constructor() {
        this.tileSize = 16;
        this.loadLevel();
    }

    loadLevel() {
        const levelData = JSON.parse(fs.readFileSync(path.join(__dirname, '../level.json'), 'utf8'));
        this.width = levelData.width;
        this.height = levelData.height;
        this.collisionMap = new Set();

        // Get the tileset collision properties
        const tileset = levelData.tilesets[0];
        const collidableTiles = new Set();
        tileset.tiles?.forEach(tile => {
            if (tile.properties?.some(prop => prop.name === 'collidable' && prop.value === true)) {
                collidableTiles.add(tile.id + tileset.firstgid);
            }
        });

        // Process all layers
        levelData.layers.forEach(layer => {
            layer.data.forEach((tileId, index) => {
                if (tileId !== 0 && collidableTiles.has(tileId)) {
                    const x = (index % this.width) * this.tileSize;
                    const y = Math.floor(index / this.width) * this.tileSize;
                    this.collisionMap.add(`${x},${y}`);
                }
            });
        });
    }

    isColliding(x, y) {
        // Check map boundaries
        if (x < 0 || y < 0 || 
            x >= this.width * this.tileSize || 
            y >= this.height * this.tileSize) {
            return true;
        }

        // Convert position to tile coordinates
        const tileX = Math.floor(x / this.tileSize) * this.tileSize;
        const tileY = Math.floor(y / this.tileSize) * this.tileSize;
        return this.collisionMap.has(`${tileX},${tileY}`);
    }
}

module.exports = Level; 