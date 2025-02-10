/*
This script is intended to handle the server and routing for the application
*/

// Node imports
import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config';
import session from 'express-session';
import flash from 'connect-flash';

// File imports
import { Transaction } from './models/TableCreation.js';
import transactionRoutes from './routes/transactions.js';
import { router as authRoutes, requireAuth } from './routes/auth.js';
import { connect } from './config/db.js';
import authenticateToken from './middleware/auth.js';
import { transactionLimiter } from './middleware/rateLimit.js';
import mainRouter from './routes/route.js';

// Vercel imports
import { inject } from "@vercel/analytics" // dev import for analytics
import { injectSpeedInsights } from '@vercel/speed-insights'; // dev import for speed insights

inject() // analytics
injectSpeedInsights() // speed insights

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 2555;

// Connect to PostgreSQL
connect().catch(err => {
    console.error('Failed to connect to the database:', err);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(flash());

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Static file serving setup
app.use(express.static('public', {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0
}));

// Add this middleware to set proper headers for CSS files
app.use((req, res, next) => {
    if (req.url.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
        // Prevent caching
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    next();
});

// Routes setup - order matters!
// 1. First, set up auth routes
app.use('/auth', authRoutes);

// 2. Then the home route
app.get('/', (req, res) => {
    res.render('pages/landingpage');
});

// 3. Protected dashboard route
app.get('/dashboard', authenticateToken, async (req, res) => { 
    try {
        if (req.isGuest) {
            return res.render('pages/guest-dashboard', {
                user: { name: 'Guest User' },
                transactions: [],
                success: req.flash('success'),
                error: req.flash('error')
            });
        }
        // Regular user flow
        const transactions = await Transaction.findAll({
            where: { user_id: req.userId },
            order: [['transaction_date', 'DESC']]
        });

        res.render('pages/index', {
            transactions: transactions.map(t => t.toJSON()),
            user: req.user
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('pages/error', {
            error: 'Error loading dashboard'
        });
    }
});

// 4. Then the main router
app.use('/', mainRouter);

// 5. Transaction routes
app.use('/transactions', authenticateToken, transactionLimiter, transactionRoutes);

// 6. Error handling
app.use((err, req, res, next) => { 
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// 7. Catch-all route last
app.get('*', (req, res) => {
    res.redirect('/');
});

// Made by A^2
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
