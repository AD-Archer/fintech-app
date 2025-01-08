import { Sequelize } from 'sequelize';
import pg from 'pg';
import 'dotenv/config';

let sequelize;

if (process.env.VERCEL_ENV) {
    // Configuration for Vercel deployment
    sequelize = new Sequelize(process.env.DATABASE_URL, { // I orginally had plans to have seperate databases for production and testing environments but decided against it at this point and time
        dialect: 'postgres',
        dialectModule: pg,
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });
} else {
    // Local development configuration
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectModule: pg,
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    });
}

// Function to connect to the database
export async function connect() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connected to PostgreSQL database');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        throw err;
    }
}

export default sequelize;