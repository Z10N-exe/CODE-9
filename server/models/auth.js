const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const user = new User({
      email,
      password: hashedPassword,
      verificationToken,
    });
    await user.save();

    const verificationLink = `http://localhost:3000/verify.html?token=${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Code 9 Account',
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your account.</p>`,
    });

    res.status(201).json({ message: 'User created. Please verify your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Email
router.get('/verify', async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(400).json({ message: 'Invalid token' });

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.redirect('/dashboard.html');
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Job Request (for real-time streaks)
router.post('/job-request', async (req, res) => {
  const { userId, jobTitle } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: 'User not found' });

    user.jobRequests.push({ jobTitle });
    user.streak = user.jobRequests.length; // Simple streak calculation
    await user.save();

    // Emit real-time update via Socket.IO
    req.io.emit('streakUpdate', { userId, streak: user.streak, jobRequests: user.jobRequests });

    res.json({ message: 'Job request added', streak: user.streak });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;