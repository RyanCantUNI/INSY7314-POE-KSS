const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const securityMiddleware = require('./middleware/security');

dotenv.config();
const app = express();

// Middleware for security
app.use(securityMiddleware.forceHttps);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()),
  credentials: true
}));

// CSRF protection
app.use(csurf({ cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' } }));

// Routes
app.use('/api/auth', authRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message });
});

const port = process.env.PORT || 443;
app.listen(port, () => console.log(`Server listening on port ${port}`));