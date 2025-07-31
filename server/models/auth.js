const express = require('express');
const transporter = require('../config/nodemailer');
const router = express.Router();

// Store verification tokens temporarily in memory (for demo; use Redis in production)
const verificationTokens = new Map();

// Signup
router.post('/signup', async (req, res) => {
    const { email, userId } = req.body;
    try {
        const verificationToken = Math.random().toString(36).slice(2);
        verificationTokens.set(verificationToken, { email, userId, timestamp: Date.now() });

        // Send verification email
        const verificationUrl = `http://localhost:5000/verify/${verificationToken}`;
        await transporter.sendMail({
            to: email,
            subject: 'Verify Your Code 9 Account',
            html: `Click <a href="${verificationUrl}">here</a> to verify your account.`,
        });

        res.json({ message: 'Registration successful. Please verify your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify Email
router.get('/verify/:token', (req, res) => {
    const tokenData = verificationTokens.get(req.params.token);
    if (!tokenData) return res.status(400).json({ message: 'Invalid or expired token' });

    // Token valid for 1 hour
    if (Date.now() - tokenData.timestamp > 60 * 60 * 1000) {
        verificationTokens.delete(req.params.token);
        return res.status(400).json({ message: 'Token expired' });
    }

    req.session.userId = tokenData.userId;
    verificationTokens.delete(req.params.token);
    res.redirect('/dashboard');
});

// Login
router.post('/login', (req, res) => {
    const { userId } = req.body;
    req.session.userId = userId; // Simplified; in production, validate against stored user data
    res.json({ message: 'Login successful' });
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

module.exports = router;