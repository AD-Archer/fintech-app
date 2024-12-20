import express from 'express';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import 'dotenv/config';
import taskRoutes from './routes/route.js';
import { router as authRoutes } from './routes/auth.js';
import { connect } from './config/db.js';
import authenticateToken from './middleware/auth.js';
import session from 'express-session';
import { Transaction } from './models/DatabaseCreation.js';
import transactionRoutes from './routes/transactions.js';
import flash from 'connect-flash';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 2555;

// Connect to PostgreSQL
connect().catch(err => {
    console.error('Failed to connect to the database:', err);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(flash());

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Dashboard route (protected)
app.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { user_id: req.userId },
            order: [['transaction_date', 'DESC']]
        });

        res.render('pages/index', {
            transactions: transactions.map(t => t.toJSON()),
            user: req.user
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).render('pages/error', {
            error: 'Error loading dashboard'
        });
    }
});

// Home route (public)
app.get('/', (req, res) => {
    res.render('pages/landingpage');
});

// Routes
app.use('/auth', authRoutes);
app.use('/transactions', authenticateToken, transactionRoutes);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
