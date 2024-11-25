export const createPlayerAnimations = (anims) => {
    anims.create({
        key: 'idle-down',
        frames: anims.generateFrameNumbers('player', { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'idle-right',
        frames: anims.generateFrameNumbers('player', { start: 6, end: 11 }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'idle-up',
        frames: anims.generateFrameNumbers('player', { start: 12, end: 17 }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'walk-down',
        frames: anims.generateFrameNumbers('player', { start: 18, end: 23 }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'walk-right',
        frames: anims.generateFrameNumbers('player', { start: 24, end: 29 }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'walk-up',
        frames: anims.generateFrameNumbers('player', { start: 30, end: 35 }),
        frameRate: 10,
        repeat: -1
    });

    anims.create({
        key: 'attack-down',
        frames: anims.generateFrameNumbers('player', { start: 36, end: 39 }),
        frameRate: 10,
        repeat: 0
    });

    anims.create({
        key: 'attack-right',
        frames: anims.generateFrameNumbers('player', { start: 42, end: 45 }),
        frameRate: 10,
        repeat: 0
    });

    anims.create({
        key: 'attack-up',
        frames: anims.generateFrameNumbers('player', { start: 48, end: 51 }),
        frameRate: 10,
        repeat: 0
    });

    anims.create({
        key: 'die',
        frames: anims.generateFrameNumbers('player', { start: 54, end: 56 }),
        frameRate: 10,
        repeat: 0
    });

}; 