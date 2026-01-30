const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Mock DB Connection (In a real app, use process.env.MONGO_URI)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/queuesmart';

// For this hackathon demo, we might use an in-memory DB or simple arrays if MongoDB isn't available
// But I'll set up the structure for Mongoose
/*
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));
*/

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinSlotRoom', (slotId) => {
    socket.join(`slot_${slotId}`);
    console.log(`User ${socket.id} joined room slot_${slotId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Simple status route
app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is running', time: new Date() });
});

// Register Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/admin', require('./routes/admin'));

// Handle Serve Next (Admin) - Moving logic to routes/admin.js but keeping this as backup
app.post('/api/admin/next-legacy', (req, res) => {
  const { slotId, currentToken } = req.body;
  const nextToken = currentToken + 1;

  // Broadcast update to everyone in the room
  io.to(`slot_${slotId}`).emit('queueUpdate', { slotId, currentToken: nextToken });

  res.json({ success: true, nextToken });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export io to use in other routes
module.exports = { app, server, io };
