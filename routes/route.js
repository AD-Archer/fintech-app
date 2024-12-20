import express from 'express';

const router = express.Router();

// Render index page with transactions
router.get('/', async (req, res) => {
    try {
        console.log('User ID from request:', req.userId);

        // You can remove the transaction fetching logic from here
        res.render('pages/index', {
            transactions: [] // Placeholder, as we will fetch transactions in transactions.js
        });
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({
            error: 'Error fetching transactions',
            details: err.message
        });
    }
});

// Export the router
export default router; 