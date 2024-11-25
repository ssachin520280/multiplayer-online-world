import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = io('http://localhost:3000');
    }

    setupGameStateListener(callback) {
        this.socket.on('gameState', callback);
    }

    emitPlayerInput(inputState) {
        this.socket.emit('playerInput', inputState);
    }

    getSocketId() {
        return this.socket.id;
    }
}

export default new SocketService(); 