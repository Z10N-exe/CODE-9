const express = require('express');
const { io } = require('../server');
const router = express.Router();

// Submit Job Request
router.post('/request', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ message: 'Unauthorized' });

    const { title } = req.body;
    const jobRequest = { id: Date.now(), userId: req.session.userId, title, createdAt: new Date().toISOString() };
    io.emit('jobRequestUpdate', jobRequest);
    res.status(201).json(jobRequest);
});

module.exports = router;