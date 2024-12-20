import express from 'express';
import { Transaction } from '../models/DatabaseCreation.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Create transaction
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { type, amount, description } = req.body;
        const userId = req.userId; // This should still be userId from the auth middleware

        const transaction = await Transaction.create({
            type,
            amount,
            description,
            user_id: userId // Change to match the database column name
        });

        res.status(201).json({ message: 'Transaction created successfully', transaction });
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Error creating transaction' });
    }
});

// Update transaction
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { type, amount, description } = req.body;
        const transaction = await Transaction.findOne({
            where: {
                id: req.params.id,
                user_id: req.userId // Update to match the model
            }
        });

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        await transaction.update({ type, amount, description });
        res.json(transaction);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Error updating transaction' });
    }
});

// Delete transaction
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const result = await Transaction.destroy({
            where: {
                id: req.params.id,
                user_id: req.userId // Update to match the model
            }
        });

        if (!result) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Error deleting transaction' });
    }
});

export default router; 