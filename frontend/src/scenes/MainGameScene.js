import Phaser from 'phaser';
import socketService from '../services/socketService';
import { createPlayerAnimations } from '../animations/playerAnims';
import { createSlimeAnimations } from '../animations/slimeAnims';

export default class MainGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainGameScene' });
        this.player = null;
        this.cursors = null;
        this.slimes = null;
        this.otherPlayers = new Map();
    }

    preload() {
        this.load.spritesheet('player', '/assets/sprites/player.png', {
            frameWidth: 48,
            frameHeight: 48
        });

        this.load.spritesheet('slime', '/assets/sprites/slime.png', {
            frameWidth: 32,
            frameHeight: 32
        });

        this.load.image('plains', '/assets/maps/plains.png');
        this.load.tilemapTiledJSON('map', '/assets/maps/level.json');
    }

    create() {
        // Create tilemap
        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('plains', 'plains', 16, 16, 0, 0);
        
        // Create layers
        const groundLayer = map.createLayer('Tile Layer 1', tileset);
        const decorationLayer = map.createLayer('Tile Layer 2', tileset);

        // Scale layers to match game size
        const scaleX = this.game.config.width / (map.width * map.tileWidth);
        const scaleY = this.game.config.height / (map.height * map.tileHeight);
        const scale = Math.min(scaleX, scaleY);
        
        groundLayer.setScale(scale);
        decorationLayer.setScale(scale);

        // Center the map
        const mapWidth = map.width * map.tileWidth * scale;
        const mapHeight = map.height * map.tileHeight * scale;
        const offsetX = (this.game.config.width - mapWidth) / 2;
        const offsetY = (this.game.config.height - mapHeight) / 2;
        
        groundLayer.setPosition(offsetX, offsetY);
        decorationLayer.setPosition(offsetX, offsetY);

        // Set world bounds based on map dimensions
        this.physics.world.setBounds(offsetX, offsetY, mapWidth, mapHeight);

        // Create player sprite and enable physics bounds
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);

        // Set up camera
        this.cameras.main.setRoundPixels(true);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(offsetX, offsetY, mapWidth, mapHeight);
        this.cameras.main.setZoom(1); // Adjust this value if needed

        // Create animations
        createPlayerAnimations(this.anims);
        createSlimeAnimations(this.anims);
        
        // Setup input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Create slimes group
        this.slimes = this.physics.add.group();

        // Setup socket listeners
        socketService.setupGameStateListener(this.handleGameState.bind(this));
    }

    handleGameState(gameState) {
        // Update player
        const myPlayer = gameState.players[socketService.getSocketId()];
        if (myPlayer) {
            this.updatePlayerState(this.player, myPlayer);
        }

        // Update other players
        this.updateOtherPlayers(gameState.players);

        // Update slimes
        this.updateSlimes(gameState.slimes);
    }

    updatePlayerState(playerSprite, state) {
        playerSprite.x = state.x;
        playerSprite.y = state.y;
        playerSprite.flipX = state.flipX;
        playerSprite.anims.play(state.animation, true);
    }

    updateOtherPlayers(players) {
        // Remove players that have left the game
        for (const [id, sprite] of this.otherPlayers.entries()) {
            if (!players[id]) {
                sprite.destroy();
                this.otherPlayers.delete(id);
            }
        }

        // Update or create other players
        for (const [id, playerState] of Object.entries(players)) {
            // Skip our own player
            if (id === socketService.getSocketId()) continue;

            let otherPlayer = this.otherPlayers.get(id);
            if (!otherPlayer) {
                // Create new player sprite if it doesn't exist
                otherPlayer = this.physics.add.sprite(playerState.x, playerState.y, 'player');
                this.otherPlayers.set(id, otherPlayer);
            }

            // Update player state
            this.updatePlayerState(otherPlayer, playerState);
        }
    }

    updateSlimes(slimeStates) {
        // Clear existing slimes
        this.slimes.clear(true, true);
        
        // Create new slimes based on server state
        slimeStates.forEach(slimeState => {
            const slime = this.slimes.create(slimeState.x, slimeState.y, 'slime');
            
            // Set animation based on movement
            if (Math.abs(slimeState.velocityX) > 0 || Math.abs(slimeState.velocityY) > 0) {
                slime.anims.play('slime-hop', true);
            } else {
                slime.anims.play('slime-idle', true);
            }
            
            // Flip sprite based on movement direction
            slime.flipX = slimeState.velocityX < 0;
            
            // Optional: Set velocity if you want client-side interpolation
            slime.setVelocity(slimeState.velocityX, slimeState.velocityY);
        });
    }

    update() {
        const inputState = {
            left: this.cursors.left.isDown,
            right: this.cursors.right.isDown,
            up: this.cursors.up.isDown,
            down: this.cursors.down.isDown,
            space: Phaser.Input.Keyboard.JustDown(this.cursors.space)
        };

        socketService.emitPlayerInput(inputState);
    }
} 