const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

// --- Server Setup ---

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS settings to allow your frontend to connect
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend's URL
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

// --- WebSocket Connection Handling ---

io.on('connection', (socket) => {
  console.log(`[INFO] User connected: ${socket.id}`);

  // Listen for a new chat message from a client
  socket.on('chat message', (msg) => {
    console.log(`[MESSAGE] ${socket.id}: ${msg}`);
    // Broadcast the message to all other clients
    socket.broadcast.emit('chat message', msg);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log(`[INFO] User disconnected: ${socket.id}`);
  });
});

// --- Basic HTTP Route ---

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

server.listen(PORT, () => {
  console.log(`[SERVER] Listening on http://localhost:${PORT}`);
});
