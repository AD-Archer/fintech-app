import Sequelize  from 'sequelize'; // Import Sequelize
import 'dotenv/config'; // Automatically loads .env file

// Set up the Sequelize connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres', // Specify the dialect
});

// Function to connect to the database
export async function connect() {
    try {
        await sequelize.authenticate(); // Authenticate the connection
        sequelize.sync()
        console.log('Connected to the PostgreSQL server.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}

// Export the sequelize instance for use in other parts of the app
export default sequelize;