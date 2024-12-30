import rateLimit from 'express-rate-limit';

// Create a limiter for transaction CRUD operations
export const transactionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute window
    max: 30, // Limit each IP to 30 transaction operations per minute
    message: { error: 'Too many transaction requests, please try again in a minute' },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({ error: 'Too many transaction requests, please try again in a minute' });
    },
    // Only apply to POST, PUT, DELETE operations
    skip: (req, res) => {
        return req.method === 'GET';
    }
}); 