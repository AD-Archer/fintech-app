import express from 'express';
import  Transaction  from '../models/DatabaseCreation.js';
import  authenticateToken  from '../middleware/auth.js';

const router = express.Router();

// Create transaction
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { type, amount, description } = req.body;
        const userId = req.userId; // From auth middleware

        const transaction = await Transaction.create({
            type,
            amount,
            description,
            userId
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
                userId: req.userId
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
                userId: req.userId
            }
        });

        if (!result) {
            req.flash('error', 'Transaction not found');
            return res.status(404).json({ error: 'Transaction not found' });
        }

        req.flash('success', 'Transaction deleted successfully');
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        req.flash('error', 'Error deleting transaction');
        res.status(500).json({ error: 'Error deleting transaction' });
    }
});

export default router; 