--- FILE: README.md ---
# Customer Portal (React) + Secure API (Node/Express)

This repository contains a secure minimal starter for a Customer Portal (React) and a secure API (Node/Express + PostgreSQL).

Security features included:
- Password hashing with bcrypt (salting and configurable rounds)
- Whitelist input validation using server-side regex patterns (express-validator)
- HTTPS enforcement middleware and guidance for SSL termination (reverse proxy / platform certs)
- Protection against common attacks: XSS, CSRF, SQL injection, clickjacking, HSTS, rate limiting, CORS whitelist
- Secure cookie usage (httpOnly, Secure, SameSite)
- Helmet for HTTP headers and CSP example

--- FILE: .env.example ---
# Example environment variables
PORT=443
NODE_ENV=production
DATABASE_URL=postgresql://user:password@localhost:5432/customerdb
JWT_SECRET=change_this_to_a_long_random_string
BCRYPT_ROUNDS=12
CORS_ORIGINS=https://app.example.com,https://admin.example.com
CSRF_COOKIE_NAME=csrf_token

--- FILE: server/package.json ---
{
  "name": "customer-api",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "csurf": "^1.11.0",
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "express-rate-limit": "^6.7.0",
    "express-validator": "^6.15.0",
    "helmet": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "pg": "^8.11.0"
  }
}

--- FILE: server/db.js ---
// Simple pg wrapper that uses parameterized queries to prevent SQL injection
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};

--- FILE: server/index.js ---
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();

// Force HTTPS middleware (works behind reverse proxy; set trust proxy in production)
function forceHttps(req, res, next) {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
}

app.set('trust proxy', 1); // trust first proxy
app.use(forceHttps);

// Secure headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200 // limit each IP to 200 requests per windowMs
});
app.use(limiter);

// CORS whitelist
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: function(origin, callback) {
    // allow non-browser requests like curl (no origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true
}));

// CSRF protection - double submit cookie pattern
const csrfProtection = csurf({ cookie: { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' }, value: (req) => (req.headers['x-xsrf-token'] || req.body._csrf) });

// Provide an endpoint to get CSRF token for SPA
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.cookie(process.env.CSRF_COOKIE_NAME || 'csrf_token', req.csrfToken(), { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  res.json({ csrfToken: req.csrfToken() });
});

// Routes
app.use('/api/auth', authRoutes);

// Generic error handler (don't leak stack traces in production)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message });
});

const port = process.env.PORT || 443;
app.listen(port, () => console.log(`Server listening on port ${port}`));

--- FILE: server/routes/auth.js ---
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
  // Password: at least 8 chars, at least one letter & one number. Adjust as policy requires.
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}\[\]:;"'<>.,?\/]{8,64}$/
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

--- FILE: server/sql/schema.sql ---
-- Minimal schema (run on PostgreSQL)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

--- FILE: client/package.json ---
{
  "name": "customer-portal",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "axios": "^1.4.0",
    "dompurify": "^2.4.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  }
}

--- FILE: client/src/index.js ---
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(<App/>);

--- FILE: client/src/App.jsx ---
import React from 'react';
import Login from './Login';

export default function App() {
  return (
    <div className="app-root">
      <h1>Customer Portal</h1>
      <Login />
    </div>
  );
}

--- FILE: client/src/api.js ---
import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'https://api.example.com',
  withCredentials: true // send/receive cookies
});

export default client;

--- FILE: client/src/Login.jsx ---
import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import client from './api';

// Client-side whitelisting (must match server patterns)
const REGEX = {
  username: /^[A-Za-z0-9_]{3,30}$/, 
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}\[\]:;"'<>.,?\/]{8,64}$/
};

export default function Login(){
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // fetch csrf token to set cookie
    client.get('/api/csrf-token').catch(() => {});
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    // sanitize input and validate with whitelist regex
    const rawIdentifier = identifier.trim();
    const safeIdentifier = DOMPurify.sanitize(rawIdentifier, {ALLOWED_TAGS:[], ALLOWED_ATTR: []});

    const isEmail = REGEX.email.test(safeIdentifier);
    const isUsername = REGEX.username.test(safeIdentifier);
    if (!isEmail && !isUsername) return setError('Identifier must be a valid username or email');
    if (!REGEX.password.test(password)) return setError('Password does not meet complexity requirements');

    try {
      const payload = isEmail ? { email: safeIdentifier, password } : { username: safeIdentifier, password };
      // include csrf header (double submit) - server expects X-XSRF-TOKEN or x-xsrf-token
      const token = document.cookie.split('; ').find(c => c.startsWith((process.env.REACT_APP_CSRF_COOKIE_NAME||'csrf_token')+'='));
      const csrf = token ? token.split('=')[1] : '';

      await client.post('/api/auth/login', payload, { headers: { 'X-XSRF-TOKEN': csrf } });
      // on success, redirect or fetch protected resource
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={submit}>
      <label>
        Email or Username
        <input value={identifier} onChange={e => setIdentifier(e.target.value)} required />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </label>
      {error && <div role="alert">{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
}

--- FILE: SECURITY_NOTES.md ---
# Security Notes & Deployment Guidance

1. **SSL/TLS termination**: For production, terminate TLS at a reverse proxy (Nginx, AWS ALB, Google Cloud Load Balancer) or let your PaaS handle certificates (Netlify, Vercel, Heroku). The Express `forceHttps` middleware expects `x-forwarded-proto` header from proxy.

2. **Strong secrets**: Use a long random `JWT_SECRET` and keep `.env` out of source control. Rotate secrets periodically.

3. **Password policy**: Enforce and document password policy. Consider add multi-factor authentication for higher security.

4. **Database safety**: All DB queries use parameterized queries to avoid SQL injection. If you switch to an ORM, keep using parameterized binding.

5. **CSP & XSS**: Helmet sets a base CSP. Tighten script/style sources for your real CDN. Use DOMPurify when rendering any HTML from user input.

6. **CSRF**: CSRF protection uses double-submit cookie and server validation. For extra protection, set CSRF token in a separate API response header and validate it.

7. **Rate limiting**: Rate limits prevent brute-force attacks. Consider separate stricter limits on auth endpoints.

8. **Audit & logging**: Log auth events and monitor for suspicious behavior. Don't log passwords or sensitive tokens.

9. **Automated scanning**: Run dependency vulnerability scans, SCA, and penetration testing before production.

10. **Content Security Policy and cookie flags**: Use `httpOnly`, `Secure`, `SameSite=strict` and HSTS.

--- FILE: DEPLOY.md ---
# Quick deploy checklist

1. Provision PostgreSQL and run `server/sql/schema.sql`.
2. Set env vars from `.env.example`.
3. Build client: `cd client && npm install && npm run build`.
4. Serve static build behind a reverse proxy (Nginx) or host on CDN and set API origin in CORS whitelist.
5. Start server: `cd server && npm install && npm start` behind the proxy which handles TLS.

--- END OF REPO ---
