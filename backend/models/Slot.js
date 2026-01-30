const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  maxCapacity: { type: Number, required: true },
  currentToken: { type: Number, default: 0 },
  bookedCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Slot', SlotSchema);
