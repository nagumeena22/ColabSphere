const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const { authenticateToken } = require('../middleware/AuthMiddleware');

// GET /profile
// Protected route
router.get('/', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            id: user._id,
            regNo: user.regNo,
            name: user.name,
            email: user.email,
            age: user.age,
            gender: user.gender,
            department: user.department,
            role: user.role,
            activeBooks: user.activeBooks,
            bookHistory: user.bookHistory,
            maxBooksAllowed: user.maxBooksAllowed,
            createdAt: user.createdAt
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
