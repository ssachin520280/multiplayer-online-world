import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';
import MainGameScene from './scenes/MainGameScene';

const config = {
    ...gameConfig,
    scene: MainGameScene
};

new Phaser.Game(config);

