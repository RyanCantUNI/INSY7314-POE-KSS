const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const router = express.Router();

const pwdRounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

// Whitelist regex patterns (server-side authoritative)
const REGEX = {
  username: /^[A-Za-z0-9_]{3,30}$/, // letters, numbers, underscore, 3-30 chars
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, // simple email pattern (whitelist)
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}\[\]:;"'<>.,?\/]{8,64}$/ // Password: at least 8 chars, at least one letter & one number
};

// Register user
router.post('/register', [
  body('username').matches(REGEX.username),
  body('email').matches(REGEX.email),
  body('password').matches(REGEX.password)
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check existing user
    const userExists = await db.query('SELECT id FROM users WHERE email=$1 OR username=$2', [email, username]);
    if (userExists.rows.length > 0) return res.status(409).json({ error: 'User already exists' });

    const saltRounds = pwdRounds;
    const hashed = await bcrypt.hash(password, saltRounds);

    await db.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)', [username, email, hashed]);

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    next(err);
  }
});

// Login
router.post('/login', [
  body('username').optional().matches(REGEX.username),
  body('email').optional().matches(REGEX.email),
  body('password').matches(REGEX.password)
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const identifier = email || username;

    const q = email ? 'SELECT id, password_hash FROM users WHERE email=$1' : 'SELECT id, password_hash FROM users WHERE username=$1';
    const result = await db.query(q, [identifier]);

    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    // Issue JWT (short lived) and set in httpOnly secure cookie
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

    res.json({ message: 'Logged in' });
  } catch (err) {
    next(err);
  }
});

// Example protected route
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const result = await db.query('SELECT id, username, email FROM users WHERE id=$1', [req.userId]);
    res.json({ user: result.rows[0] });
  } catch (err) { next(err); }
});

module.exports = router;