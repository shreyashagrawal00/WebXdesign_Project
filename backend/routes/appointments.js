const express = require('express');
const router = express.Router();
const db = require('../mockDb');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Book Appointment
router.post('/', auth, async (req, res) => {
  try {
    const { slotId } = req.body;
    const slot = await db.findSlotById(slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.bookedCount >= slot.maxCapacity) return res.status(400).json({ message: 'Slot is full' });

    const tokenNumber = 101 + slot.bookedCount;
    const appointment = await db.saveAppointment({
      userId: req.user.id,
      slotId: slot._id,
      tokenNumber,
      action: req.body.action,
      status: 'waiting'
    });

    await db.updateSlot(slotId, { bookedCount: slot.bookedCount + 1 });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user appointments
router.get('/user', auth, async (req, res) => {
  try {
    const appointments = await db.getUserAppointments(req.user.id);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel Appointment
router.post('/cancel/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[CANCEL] Attempting to cancel appointment ${id} for user ${req.user.id}`);

    // In a real DB we would findOne({ _id: id, userId: req.user.id }) to ensure ownership
    // For mockDB, we fetch all and check
    const appointments = await db.getUserAppointments(req.user.id);
    console.log(`[CANCEL] Found ${appointments.length} appointments for user`);

    const appointment = appointments.find(a => a._id === id);

    if (!appointment) {
      console.log(`[CANCEL] Appointment ${id} not found for user ${req.user.id}`);
      return res.status(404).json({ message: 'Appointment not found' });
    }

    console.log(`[CANCEL] Updating appointment ${id} to cancelled status`);
    const updated = await db.updateAppointment(id, { status: 'cancelled' });
    console.log(`[CANCEL] Update result:`, updated);

    // Optional: Decrement slot count if needed, but for now we just mark as cancelled
    res.json({ message: 'Appointment cancelled', appointment: updated });
  } catch (err) {
    console.error(`[CANCEL ERROR]`, err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
