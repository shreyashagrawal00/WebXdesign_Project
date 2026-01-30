const express = require('express');
const router = express.Router();
const db = require('../mockDb');

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await db.getServices();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get slots for a service
router.get('/:serviceId/slots', async (req, res) => {
  try {
    const { date } = req.query;
    const slots = await db.getSlots(req.params.serviceId);
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed Initial Data
router.post('/seed', async (req, res) => {
  try {
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
        actions: ['Verify PAN Status', 'Download E-PAN', 'Correction in PAN', 'New PAN Application']
      },
      {
        name: 'Passport Service',
        department: 'Official Identity Documents',
        description: 'New passport and re-issue',
        actions: ['Track Application Status', 'Appointment Availability', 'Re-issue Passport', 'Fresh Passport Application']
      },
      {
        name: 'Driving License',
        department: 'Official Identity Documents',
        description: 'License services and tests',
        actions: ['Know Your DL Status', 'Download Digital DL', 'DL Renewal', 'New Driving License']
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
    const services = await db.getServices();

    const today = new Date().toISOString().split('T')[0];
    const slots = [];
    services.forEach(service => {
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
    res.json({ message: 'Success', services });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
