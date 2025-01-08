import jwt from 'jsonwebtoken';
import { User } from '../models/TableCreation.js';

const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.userId = decoded.userId;
        
        // Fetch user data
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Add user data to request
        req.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(403).json({ error: 'Invalid token.' });
    }
};

export default authenticateToken;
