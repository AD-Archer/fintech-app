import express from 'express';
import methodOverride from 'method-override'; // Import method-override
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config'; // Automatically loads .env file
import taskRoutes from './routes/route.js';
import authRoutes from './routes/auth.js';
import { connect } from './config/db.js'; // Import the connect function from db.js
import { authenticateToken } from './middleware/auth.js';

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

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/auth', authRoutes);
app.use('/', authenticateToken, taskRoutes); // Protect all routes except auth routes

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
