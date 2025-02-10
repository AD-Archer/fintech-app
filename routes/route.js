import express from 'express';

const router = express.Router();

// Render index page with transactions
router.get('/', async (req, res) => {
    try {
        res.render('pages/index', {
            transactions: [] 
        });
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({
            error: 'Error fetching transactions',
            details: err.message
        });
    }
});

// Guest dashboard route - make it explicit
router.get('/guest-dashboard', (req, res) => {
    console.log('Guest dashboard route hit');
    try {
        res.render('pages/guest-dashboard', {
            user: { name: 'Guest' },
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (err) {
        console.error('Error rendering guest dashboard:', err);
        res.status(500).render('pages/error', { 
            error: 'Error loading guest dashboard' 
        });
    }
});

// Export the router
export default router; 