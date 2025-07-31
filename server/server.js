const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = 3000;

// In-memory user storage (replace with a database in production)
let users = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// Nodemailer transporter (using Ethereal for testing)
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
        user: 'jaron.nader46@ethereal.email', // Replace with Ethereal credentials
        pass: 'RUMbRGKZqJRMyY4rSu', // Replace with Ethereal credentials
    },
});

// Serve signup page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve dashboard page
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Handle signup
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    if (users.find(user => user.email === email)) {
        return res.json({ success: false, message: 'Email already registered!' });
    }

    // Save user
    users.push({ email, password });
    
    // Send confirmation email
    try {
        const emailTemplate = await ejs.renderFile(path.join(__dirname, 'views', 'email-template.ejs'), { email });
        const mailOptions = {
            from: '"Code 9" <your-ethereal-user@ethereal.email>',
            to: email,
            subject: 'Welcome to Code 9!',
            html: emailTemplate,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        res.json({ success: true, message: 'You have successfully registered. Please login to view your dashboard.' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.json({ success: false, message: 'Registration successful, but failed to send email.' });
    }
});

// Handle login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        res.json({ success: true, message: 'Login successful!', user });
    } else {
        res.json({ success: false, message: 'Invalid email or password!' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});