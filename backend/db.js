import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set up MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

// Function to connect to the database
export function connect() {
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            process.exit(1); // Exit process on database connection error
        }
        console.log('Connected to the MySQL database.');
    });
}

// Export the connection for use in other parts of the app
export { connection };