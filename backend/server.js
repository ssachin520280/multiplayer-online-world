const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});
const path = require('path');
const GameState = require('./game/GameState');

// Initialize game state
const gameState = new GameState();

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('a user connected');

    // Initialize player state
    gameState.addPlayer(socket.id);

    socket.on('playerInput', (input) => {
        gameState.updatePlayerInput(socket.id, input);
    });

    socket.on('disconnect', () => {
        gameState.removePlayer(socket.id);
        console.log('user disconnected');
    });
});

// Game loop
setInterval(() => {
    const state = gameState.update();
    io.emit('gameState', state);
}, 16); // 60fps

// Start server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 