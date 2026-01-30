const express = require('express');
const router = express.Router();
const db = require('../mockDb');
const jwt = require('jsonwebtoken');

// Admin Auth Middleware
const adminAuth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.role !== 'admin') return res.status(403).json({ message: 'Access denied: Admin only' });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Advance Queue
router.post('/next', adminAuth, async (req, res) => {
  try {
    const { slotId } = req.body;
    const slot = await db.findSlotById(slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    const nextToken = slot.currentToken + 1;
    await db.updateSlot(slotId, { currentToken: nextToken });

    const { io } = require('../server');
    io.to(`slot_${slotId}`).emit('queueUpdate', { slotId, currentToken: nextToken });

    res.json({ currentToken: nextToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all appointments
router.get('/appointments/all', adminAuth, async (req, res) => {
  try {
    const appointments = await db.getAllAppointments();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
