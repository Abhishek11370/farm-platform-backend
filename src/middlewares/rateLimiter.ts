import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    data: null,
    meta: null,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests, please try again later.'
    }
  }
});

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 login requests per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    data: null,
    meta: null,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many login attempts, please try again in 5 minutes.'
    }
  }
});
