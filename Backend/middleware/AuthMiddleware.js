const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

// Secret key for JWT (In production, use environment variables)
const JWT_SECRET = process.env.JWT_SECRET

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach userId to request
        req.userId = decoded.userId;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please login again.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token.' });
        }
        res.status(500).json({ message: 'Server error during authentication.' });
    }
};

// Middleware to check if user is admin
// Must be used AFTER authenticateToken
const authorizeAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('role');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error during authorization.' });
    }
};

module.exports = { authenticateToken, authorizeAdmin, JWT_SECRET };