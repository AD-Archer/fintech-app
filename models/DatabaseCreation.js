import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';

const Transaction = sequelize.define('Transaction', {
    type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
}, { timestamps: true });

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: true });

// Add relationship between User and Transaction
User.hasMany(Transaction);
Transaction.belongsTo(User);

const createDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ force: true });
        console.log('Database and tables created or already exist');
        await insertSampleData();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

const insertSampleData = async () => {
    const transactionCount = await Transaction.count();
    if (transactionCount === 0) {
        await Transaction.bulkCreate([
            { type: 'income', amount: 1000.00, description: 'Initial deposit' },
            { type: 'expense', amount: 200.00, description: 'Groceries' },
            { type: 'income', amount: 500.00, description: 'Salary' },
        ]);
        console.log('Sample transaction data inserted');
    }
};

export { createDatabase, Transaction, User };