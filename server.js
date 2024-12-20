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
import { Transaction } from './models/DatabaseCreation.js';
import transactionRoutes from './routes/transactions.js';
import { router as authRoutes } from './routes/auth.js';
import { connect } from './config/db.js';
import authenticateToken from './middleware/auth.js';



const __filename = fileURLToPath(import.meta.url); // get the filename
const __dirname = path.dirname(__filename); // get the directory name

const app = express(); // initialize the express app
const port = process.env.PORT || 2555;

// Connect to PostgreSQL
connect().catch(err => {
    console.error('Failed to connect to the database:', err);
});

// Middleware
app.use(express.json()); // parse the request body as JSON
app.use(express.urlencoded({ extended: true })); // parse the request body as URL-encoded data
app.use(methodOverride('_method')); // override the HTTP method
app.use(cookieParser()); // parse the cookie header
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret', // set the session secret
    resave: false, // do not save the session if it has not changed
    saveUninitialized: true, // save uninitialized sessions
    cookie: { secure: process.env.NODE_ENV === 'production' } // secure the cookie if in production
}));
app.use(flash());

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success'); // set the success message
    res.locals.error = req.flash('error'); // set the error message
    next();
});

// View engine setup
app.set('view engine', 'ejs'); // set the view engine to ejs
app.set('views', path.join(__dirname, 'views')); // set the views directory
app.use(express.static(path.join(__dirname, 'public'))); // serve static files from the public directory(this isn't needed but its good practice to inlcude)

// Dashboard route (protected)
app.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { user_id: req.userId },
            order: [['transaction_date', 'DESC']] // order the transactions by transaction date
        });

        res.render('pages/index', {
            transactions: transactions.map(t => t.toJSON()), // map the transactions to JSON
            user: req.user // set the user
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).render('pages/error', {
            error: 'Error loading dashboard'
        });
    }
});

// Home route (public)
app.get('/', (req, res) => {
    res.render('pages/landingpage');
});

// Routes
app.use('/auth', authRoutes); // use the auth routes
app.use('/transactions', authenticateToken, transactionRoutes); // use the transaction routes
// Made by A^2
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`); // log the server is running
});
