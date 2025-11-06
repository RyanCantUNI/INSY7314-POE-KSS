import ratelimit from 'express-rate-limit';


//rate limier for handling ddos stuff
const limiter = ratelimit({
    windowMs: 15 * 60 * 1000, // 15 minutes duration window
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export default limiter