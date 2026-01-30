const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
  tokenNumber: { type: Number, required: true },
  status: { type: String, enum: ['waiting', 'completed', 'cancelled', 'absent'], default: 'waiting' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);
