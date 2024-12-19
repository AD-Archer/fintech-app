import express from 'express'; 
import  Transaction  from '../models/DatabaseCreation.js'; 

const router = express.Router();

// Render index page with transactions
router.get('/', async (req, res) => {
    try {
        console.log('User ID from request:', req.userId);

        const transactions = await Transaction.findAll({
            where: { userId: req.userId },
            order: [['createdAt', 'DESC']]
        });

        console.log('Found transactions:', transactions.length);
        console.log('Transaction data:', transactions);

        res.render('pages/index', { 
            transactions: transactions.map(t => t.toJSON())
        }); 
    } catch (err) {
        console.error('Error fetching transactions:', err); 
        res.status(500).json({ 
            error: 'Error fetching transactions',
            details: err.message
        });
    }
});

// Create transaction
router.post('/transactions', async (req, res) => {
    try {
        const { type, amount, description } = req.body;
        const userId = req.userId; // From auth middleware

        // Get current balance
        const transactions = await Transaction.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });

        let currentBalance = 0;
        transactions.forEach(t => {
            if (t.type === 'income') {
                currentBalance += parseFloat(t.amount);
            } else if (t.type === 'expense' || t.type === 'withdraw') {
                currentBalance -= parseFloat(t.amount);
            }
        });

        // Check if withdrawal is possible
        if (type === 'withdraw') {
            if (parseFloat(amount) > currentBalance) {
                return res.status(400).json({ error: 'Insufficient balance for withdrawal' });
            }
        }

        // Create the transaction
        const newTransaction = await Transaction.create({ 
            type, 
            amount: parseFloat(amount), 
            description,
            userId,
            balance: type === 'income' ? currentBalance + parseFloat(amount) : currentBalance - parseFloat(amount)
        });

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