// Simple In-Memory DB for Demo
class MockDB {
  constructor() {
    this.users = [];
    this.services = [];
    this.slots = [];
    this.appointments = [];
  }

  // User Methods
  async findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }
  async saveUser(user) {
    user._id = Math.random().toString(36).substr(2, 9);
    this.users.push(user);
    return user;
  }

  // Service Methods
  async getServices() {
    return this.services;
  }
  async setServices(services) {
    this.services = services.map(s => ({ ...s, _id: Math.random().toString(36).substr(2, 9) }));
  }

  // Slot Methods
  async getSlots(serviceId) {
    return this.slots.filter(s => s.serviceId === serviceId);
  }
  async findSlotById(id) {
    return this.slots.find(s => s._id === id);
  }
  async setSlots(slots) {
    this.slots = slots.map(s => ({ ...s, _id: Math.random().toString(36).substr(2, 9), currentToken: 0, bookedCount: 0 }));
  }
  async updateSlot(id, updates) {
    const index = this.slots.findIndex(s => s._id === id);
    if (index !== -1) {
      this.slots[index] = { ...this.slots[index], ...updates };
      return this.slots[index];
    }
  }

  // Appointment Methods
  async saveAppointment(appt) {
    appt._id = Math.random().toString(36).substr(2, 9);
    this.appointments.push(appt);
    return appt;
  }
  async getUserAppointments(userId) {
    return this.appointments.filter(a => a.userId === userId).map(a => {
      const slot = this.slots.find(s => s._id === a.slotId);
      const service = slot ? this.services.find(ser => ser._id === slot.serviceId) : null;
      return { ...a, slotId: { ...slot, serviceId: service } };
    });
  }
  async getAllAppointments() {
    return this.appointments.map(a => {
      const user = this.users.find(u => u._id === a.userId);
      const slot = this.slots.find(s => s._id === a.slotId);
      const service = slot ? this.services.find(ser => ser._id === slot.serviceId) : null;
      if (!slot) return { ...a, userId: user, slotId: null };
      return { ...a, userId: user, slotId: { ...slot, serviceId: service } };
    });
  }
  async updateAppointment(id, updates) {
    const index = this.appointments.findIndex(a => a._id === id);
    if (index !== -1) {
      this.appointments[index] = { ...this.appointments[index], ...updates };
      return this.appointments[index];
    }
    return null;
  }

  // Update logic for changing slot timings globally for a service
  // In a real app, this would be more complex (handling existing bookings etc.)
  async updateServiceSlotTimes(serviceId, startTime, endTime) {
    this.slots.forEach(slot => {
      if (slot.serviceId === serviceId) {
        slot.startTime = startTime;
        slot.endTime = endTime;
      }
    });
    return true;
  }

  async addSlot(serviceId, startTime, endTime, maxCapacity = 10) {
    const newSlot = {
      _id: Math.random().toString(36).substr(2, 9),
      serviceId,
      date: new Date().toISOString().split('T')[0], // Default to today for demo
      startTime,
      endTime,
      maxCapacity,
      bookedCount: 0,
      currentToken: 1
    };
    this.slots.push(newSlot);
    return newSlot;
  }

  async deleteSlot(slotId) {
    const initialLength = this.slots.length;
    this.slots = this.slots.filter(s => s._id !== slotId);
    return this.slots.length < initialLength;
  }

  async getAllSlots() {
    // populate service details if needed, for now just return slots
    // In a real DB we would use .populate()
    return this.slots.map(slot => {
      const service = this.services.find(s => s._id === slot.serviceId);
      return { ...slot, serviceId: service }; // Mock populate
    });
  }
}

const db = new MockDB();
module.exports = db;
