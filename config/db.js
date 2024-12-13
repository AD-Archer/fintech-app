import { Sequelize } from 'sequelize'; // Import Sequelize
import { fileURLToPath } from 'url';
import path from 'path';
import { config } from 'dotenv';
import { createDatabase } from '../models/DatabaseCreation.js'; // Import the function from DatabaseCreation.js

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly set the path to the .env file in the root directory
config({ path: path.resolve(__dirname, '../.env') }); // Adjust if .env is not in the root directory

// Set up Sequelize connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql', // Specify the dialect
});

// Function to connect to the database
export async function connect() {
    try {
        await sequelize.authenticate(); // Authenticate the connection
        console.log('Connected to the MySQL server.');
        
        // Invoke the database and table creation process
        await createDatabase(); // Call the function that starts the process of creating the database and tables
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        process.exit(1); // Exit process on server connection error
    }
}

// Export the sequelize instance for use in other parts of the app
export { sequelize };
