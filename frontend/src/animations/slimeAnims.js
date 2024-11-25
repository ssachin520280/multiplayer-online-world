export const createSlimeAnimations = (anims) => {
    anims.create({
        key: 'slime-idle',
        frames: anims.generateFrameNumbers('slime', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });
    
    anims.create({
        key: 'slime-hop',
        frames: anims.generateFrameNumbers('slime', { start: 21, end: 26 }),
        frameRate: 12,
        repeat: 0
    });
}; 