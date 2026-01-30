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
}

const db = new MockDB();
module.exports = db;
