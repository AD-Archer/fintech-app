import jwt from 'jsonwebtoken';
import { User } from '../models/TableCreation.js';

const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.userId = decoded.userId;
        req.isGuest = decoded.isGuest || false;
        
        // If it's a guest user, skip database check
        if (req.isGuest) {
            req.user = {
                id: decoded.userId,
                name: 'Guest User',
                isGuest: true
            };
            return next();
        }

        // For regular users, fetch from database
        try {
            const user = await User.findByPk(decoded.userId);
            if (!user) {
                res.clearCookie('token');
                return res.redirect('/auth/login');
            }

            // Add user data to request
            req.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                isGuest: false
            };

            next();
        } catch (dbError) {
            console.error('Database error:', dbError);
            res.clearCookie('token');
            return res.redirect('/auth/login');
        }
    } catch (err) {
        console.error('Token verification error:', err);
        res.clearCookie('token');
        return res.redirect('/auth/login');
    }
};

export default authenticateToken;
