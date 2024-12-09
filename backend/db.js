import mysql from 'mysql2';
import { fileURLToPath } from 'url';
import path from 'path';
import { config } from 'dotenv';
import { createDatabase } from './modules/TableCreation.js'; // Import the function from TableCreation.js

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly set the path to the .env file in the root directory
config({ path: path.resolve(__dirname, '../.env') }); // Adjust if .env is not in the root directory

// Set up MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
});

// Function to connect to the database
export function connect() {
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the MySQL server:', err);
            process.exit(1); // Exit process on server connection error
        }

        console.log('Connected to the MySQL server.');

        // Invoke the database and table creation process
        createDatabase(); // Call the function that starts the process of creating the database and tables
    });
}

// Export the connection for use in other parts of the app
export { connection };
