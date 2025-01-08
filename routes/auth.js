import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/TableCreation.js';
import { check, validationResult } from 'express-validator';

const router = express.Router();

/*
This script is intended to handle the user authentication and registration
*/


// Render register page
router.get('/register', (req, res) => { // get the register page and sends it toe auth/register
    res.render('pages/register');
});

// Render login page
router.get('/login', (req, res) => { // get the login page and sends it to auth/login
    res.render('pages/login');
});

// Handle user registration
router.post('/register', [
    check('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character'),
    check('name').notEmpty().withMessage('Name is required'),
    check('email').isEmail().withMessage('Invalid email format')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Handle user login
router.post('/login', async (req, res) => { // handle the user login
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            req.flash('error', 'Invalid email or password'); // flash the error message
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            req.flash('error', 'Invalid email or password');
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign( // create the token
            { userId: user.id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Set token in cookie
        res.cookie('token', token, { // set the token in the cookie
            httpOnly: true, // httpOnly: true, // prevent the cookie from being accessed by JavaScript
            secure: process.env.NODE_ENV === 'production', // secure: process.env.NODE_ENV === 'production', // only send the cookie over HTTPS
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        req.flash('success', 'Login successful'); // flash the success message
        res.json({
            message: 'Login successful',
            token,
            redirect: '/dashboard'
        });
    } catch (error) {
        req.flash('error', 'Error logging in');
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Handle logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => { // destroy the session
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.clearCookie('token');
        res.redirect('/auth/login');
    });
});

// Route guard middleware
const requireAuth = (req, res, next) => {
    if (!req.session.userId) { // if the userId is not in the session
        return res.redirect('/auth/login');
    }
    next();
};

export { router, requireAuth }; 