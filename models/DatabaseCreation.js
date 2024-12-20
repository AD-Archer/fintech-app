/*
This script is intended to handle the database creation and the models for the application
*/

import sequelize from '../config/db.js';
import { DataTypes } from 'sequelize';

// Define User model
const User = sequelize.define('User', { // define the User model
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
}, {
    timestamps: true,
    tableName: 'users', // define the table name
});

// Define Transaction model
const Transaction = sequelize.define('Transaction', { // define the Transaction model
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    transaction_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true, 
    tableName: 'transactions', // define the table name
});

// Define relationships
User.hasMany(Transaction, { // define the relationship between User and Transaction
    foreignKey: 'user_id', // define the foreign key
    onDelete: 'CASCADE', // delete the transaction if the user is deleted
});
Transaction.belongsTo(User, { // define the relationship between Transaction and User
    foreignKey: 'user_id', // define the foreign key
});

// Export models
export { User, Transaction };