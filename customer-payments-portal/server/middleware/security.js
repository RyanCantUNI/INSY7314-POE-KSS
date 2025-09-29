const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const csurf = require('csurf');

// Force HTTPS middleware
function forceHttps(req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
}

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200 // limit each IP to 200 requests per windowMs
});

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true
};

// CSRF protection
const csrfProtection = csurf({ cookie: { httpOnly: false, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' } });

module.exports = {
  forceHttps,
  limiter,
  corsOptions,
  csrfProtection,
  helmet: helmet()
};