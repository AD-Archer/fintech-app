// server.js
import express from 'express';
import 'dotenv/config';
import setupRoutes from './modules/SetRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { connect } from './db.js'; // Import the connect function from db.js

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Create Express app
const app = express();
const port = process.env.PORT || 2555;

// Connect to the database
connect(); // This will establish the MySQL connection

// Middleware
app.use(express.json()); // Parse JSON payloads

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// // Setup API routes from query.js
setupRoutes(app); // Initialize routes


// Check for servering running
app.get('/status', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});