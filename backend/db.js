import mysql from 'mysql2';
import dotenv from 'dotenv';
import { createDatabase } from './modules/TableCreation.js'; // Import the function from TableCreation.js

// Load environment variables
dotenv.config();

// Set up MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306
});

// Function to connect to the database
export function connect() {
    // First, connect to MySQL without specifying the database
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