import { sequelize } from '../config/db.js';
import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
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
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00 // Default balance
    }
}, { 
    timestamps: true,
    tableName: 'users'
});

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.ENUM('income', 'expense', 'withdraw'),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User, // Reference to User model
            key: 'id'
        }
    }
}, { 
    timestamps: true,
    tableName: 'transactions'
});

// Define relationships
User.hasMany(Transaction, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
});
Transaction.belongsTo(User, {
    foreignKey: 'userId'
});

const createDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        
        // Create tables if they don't exist
        await sequelize.sync();
        console.log('Database and tables synchronized');
        
        // Insert sample data only if no data exists
        await insertSampleData();
    } catch (error) {
        console.error('Unable to initialize database:', error);
    }
};

// Export the function along with User and Transaction models
export { createDatabase, User, Transaction };