const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Mock user data
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' }
];

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validate user
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, username: user.username }, 'your_secret_key', { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
});

