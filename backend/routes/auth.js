const express = require('express');
const router = express.Router();
const db = require('../mockDb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    let user = await db.findUserByEmail(email);
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await db.saveUser({ name, email, phone, password: hashedPassword, role });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// In-memory OTP storage (contact -> { code, expires })
const otpStore = new Map();

// Send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { contact } = req.body;
    if (!contact) return res.status(400).json({ message: 'Contact is required' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 5-minute expiration
    otpStore.set(contact, {
      code: otp,
      expires: Date.now() + 5 * 60 * 1000
    });

    // In a real application, you would integrate with an SMS gateway (Twilio, Fast2SMS) 
    // or Email service (SendGrid, Nodemailer) here.
    // For this demo, we log it to the console and return it for easy testing.
    console.log(`\n=== OTP SENT ===\nTo: ${contact}\nCode: ${otp}\n================\n`);

    res.json({
      message: 'OTP sent successfully',
      debugOtp: otp // Included for Hackathon/Demo purposes only
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { contact, otp } = req.body;
    if (!contact || !otp) return res.status(400).json({ message: 'Contact and OTP are required' });

    const storedData = otpStore.get(contact);

    if (!storedData) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    if (Date.now() > storedData.expires) {
      otpStore.delete(contact);
      return res.status(400).json({ message: 'OTP expired' });
    }

    if (storedData.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP verified
    otpStore.delete(contact); // Clear after successful usage
    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
