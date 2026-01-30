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
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Auto-seed database if empty
  const db = require('./mockDb');
  const services = await db.getServices();
  if (services.length === 0) {
    console.log('Database empty, seeding initial data...');
    try {
      // Seed data directly instead of making HTTP request
      const depts = [
        // Official Identity Documents
        {
          name: 'Aadhaar Service',
          department: 'Official Identity Documents',
          description: 'New registration and updates',
          actions: ['Verify Aadhaar Number', 'Lock/Unlock Biometrics', 'Update Aadhaar', 'Get E-Aadhaar']
        },
        {
          name: 'PAN Card',
          department: 'Official Identity Documents',
          description: 'Application and corrections',
          actions: ['View PAN Status', 'Download E-PAN', 'Correction in PAN', 'New PAN Application']
        },
        {
          name: 'Passport Service',
          department: 'Official Identity Documents',
          description: 'New passport and re-issue',
          actions: ['View Passport Status', 'Appointment Availability', 'Re-issue Passport', 'Fresh Passport Application']
        },
        {
          name: 'Driving License',
          department: 'Official Identity Documents',
          description: 'License services and tests',
          actions: ['View DL Status', 'Download Digital DL', 'DL Renewal', 'New Driving License']
        },
        // Healthcare
        {
          name: 'Hospital Management',
          department: 'Healthcare',
          description: 'Doctor appointments and OPD',
          actions: ['Book OPD', 'Emergency Consultation', 'View Patient History', 'Follow-up Visit']
        },
        {
          name: 'Diagnosis Lab',
          department: 'Healthcare',
          description: 'Pathology and radiology reports',
          actions: ['Schedule Test', 'Home Collection', 'Download Reports', 'View Lab Locations']
        }
      ];

      await db.setServices(depts);
      const seededServices = await db.getServices();

      const today = new Date().toISOString().split('T')[0];
      const slots = [];
      seededServices.forEach(service => {
        slots.push({
          serviceId: service._id,
          date: today,
          startTime: '09:00 AM',
          endTime: '12:00 PM',
          maxCapacity: 10
        });
        slots.push({
          serviceId: service._id,
          date: today,
          startTime: '02:00 PM',
          endTime: '05:00 PM',
          maxCapacity: 10
        });
      });

      await db.setSlots(slots);
      console.log('Database seeded successfully with', seededServices.length, 'services');
    } catch (err) {
      console.error('Error seeding database:', err.message);
    }
  }
});

// Export io to use in other routes
module.exports = { app, server, io };
