import express from 'express';
import methodOverride from 'method-override'; // Import method-override
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config'; // Automatically loads .env file
import taskRoutes from './routes/route.js';
import { router as authRoutes } from './routes/auth.js'; // Use named import
import { connect } from './config/db.js'; // Import the connect function from db.js
import { authenticateToken } from './middleware/auth.js';
import session from 'express-session'; // Import express-session

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const port = process.env.PORT || 2555;

// Connect to the database
connect(); // Establish the MySQL connection

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

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRoutes); // Use named import for auth routes
app.use('/', authenticateToken, taskRoutes); // Protect all routes except auth routes

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
