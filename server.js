import express from 'express';
import methodOverride from 'method-override'; // Import method-override
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config'; // Automatically loads .env file
import taskRoutes from './routes/route.js';
import { router as authRoutes } from './routes/auth.js'; // Use named import
import  connect  from './config/pgdb.js'; // Import the connection from pgdb.js
import authenticateToken  from './middleware/auth.js';
import session from 'express-session'; // Import express-session
import Transaction  from './models/DatabaseCreation.js'; // Import Transaction model
import transactionRoutes from './routes/transactions.js';
import flash from 'connect-flash';
import http from 'http';
// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const port = process.env.PORT || 2555;

// Connect to the PostgreSQL database

// Middleware
app.use(express.json()); // Parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads
app.use(methodOverride('_method')); // Allow PUT and DELETE methods
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret', // Secret for signing the session ID cookie
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Set to true if using HTTPS
}));
app.use(flash());

// Add a middleware to make flash messages available to all templates
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Dashboard route (protected)
app.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        // Get user's transactions from the database
        const transactions = await Transaction.findAll({
            where: { userId: req.userId },
            order: [['createdAt', 'DESC']] // Order by most recent first
        });

        // Render index page with transactions data
        res.render('pages/index') // {
            // transactions: transactions,
            // user: req.user // If you need user data as well
        // });
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
app.use('/auth', authRoutes); // Auth routes
app.use('/transactions', authenticateToken, transactionRoutes); // Transaction routes
app.use('/tasks', authenticateToken, taskRoutes); // Protected task routes


// // verify connectoin to postgres
// const requestHandler = (req, res) => {
//     // Check if req and res are defined
//     if (!req || !res) {
//         console.error('Request or response is undefined');
//         return;
//     }

//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.end('pages/landingpage');
// };

// const server = http.createServer(requestHandler);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
