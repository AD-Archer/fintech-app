import express from 'express';
import mysql from 'mysql2';
import dotenv from 'dotenv';
import { validateTask } from './validateTask.js'; // Import the validateTask function
import setupRoutes from './query.js'; // Import the setupRoutes function
import path from 'path'; // Import path to handle file paths
import { fileURLToPath } from 'url';

const __fileURLToPath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileURLToPath)

console.log(__dirname)
dotenv.config();
const app = express();
const port = 2555;

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database.');
});

app.use(express.json()); // Middleware to parse JSON
app.use(validateTask); // Use the validateTask middleware

// Serve index.html when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Setup routes from query.js
setupRoutes(app); // Call the setupRoutes function with the app instance

// Other routes
app.get('/api', (req, res) => {
    res.send({ message: 'API Home!' });
});

app.get('/status', (req, res) => {
    res.send({ status: 'Server is running' });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// Export the connection
export { connection }; 