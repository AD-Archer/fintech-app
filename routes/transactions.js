import express from 'express';
import { Transaction } from '../models/TableCreation.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();
/*
This script is intended to handle the routing for the transactions
*/
// Create transaction
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { type, amount, description } = req.body;
        const userId = req.userId; // From auth middleware

        // Create the transaction
        const newTransaction = await Transaction.create({
            type,
            amount: parseFloat(amount),
            description,
            user_id: userId // Ensure this matches your database schema
        });

        res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating transaction' });
    }
});

// Update transaction
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const transactionId = req.params.id;
        const { type, amount, description } = req.body;

        const [updated] = await Transaction.update(
            { type, amount, description },
            { where: { id: transactionId, user_id: req.userId } } // Ensure user_id is checked
        );

        if (updated) {
            res.status(200).json({ message: 'Transaction updated successfully' });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(400).json({ message: 'Error updating transaction', error: error.message });
    }
});

// Delete transaction
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Transaction.destroy({
            where: {
                id,
                user_id: req.userId // Ensure user_id is checked
            }
        });
        if (deleted) {
            res.json({ message: 'Transaction deleted successfully' });
        } else {
            res.status(404).json({ error: 'Transaction not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting transaction' });
    }
});

// Export the router
export default router; 