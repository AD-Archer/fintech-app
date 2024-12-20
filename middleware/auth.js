import jwt from 'jsonwebtoken';


const authenticateToken = (req, res, next) => { // middleware to authenticate the token
    const token = req.cookies.token; // get the token from the cookies

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key'); // verify the token
        req.userId = decoded.userId; // set the userId to the decoded token
        next(); // call the next middleware
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(403).json({ error: 'Invalid token.' });
    }
}; 

export default authenticateToken;
