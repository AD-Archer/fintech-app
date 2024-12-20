import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

// Function to connect to the database
export async function connect() {
    try {
        await sequelize.authenticate();
        await sequelize.sync(); // This will create tables if they don't exist
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}

export default sequelize;