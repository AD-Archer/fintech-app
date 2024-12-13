import express from 'express'; 
import { Transaction } from '../models/DatabaseCreation.js'; 

const router = express.Router();

// Render index page with transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.findAll(); 
        res.render('pages/index', { transactions }); 
    } catch (err) {
        console.error('Error fetching transactions:', err); 
        res.status(500).json({ error: 'Error fetching transactions' });
    }
});

// Create transaction
router.post('/transactions', async (req, res) => {
    try {
        const { type, amount, description } = req.body;
        await Transaction.create({ type, amount, description }); 
        res.redirect('/'); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creating transaction' });
    }
});

// Update transaction
router.put('/transactions/:id', async (req, res) => {
    try {
        const transactionId = req.params.id;
        const { type, amount, description } = req.body;

        const [updated] = await Transaction.update(
            { type, amount, description },
            { where: { id: transactionId } }
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
router.delete('/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Transaction.destroy({
            where: { id }
        });
        if (deleted) {
            res.redirect('/'); 
        } else {
            res.status(404).json({ error: 'Transaction not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error deleting transaction' });
    }
});

export default router; 