// Import required modules
import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import { validateTask } from './validateTask.js'; // Middleware for task validation
import setupRoutes from './query.js'; // Function to setup routes
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Debugging: Check if environment variables are loaded
console.log({
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD ? '****' : 'NOT SET',
    DB_NAME: process.env.DB_NAME
});

// Create Express app
const app = express();
const port = process.env.PORT || 2555;

// Set up MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit process on database connection error
    }
    console.log('Connected to the MySQL database.');
});

// Middleware
app.use(express.json()); // Parse JSON payloads
app.use(validateTask); // Task validation middleware

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Setup API routes from query.js
setupRoutes(app); // Initialize routes

// Health check route
app.get('/status', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// Export the MySQL connection
export { connection };
