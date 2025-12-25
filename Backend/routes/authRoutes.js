const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const {  authenticateToken } = require('../middleware/AuthMiddleware');
const JWT_SECRET = process.env.JWT_SECRET;

// ============== AUTH ROUTES ==============

// REGISTER - Create a new user account
router.post('/register', async (req, res) => {
    try {
        const { regNo, name, email, password, age, gender, department, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { regNo }] 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists with this email or registration number' 
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            regNo,
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            department,
            role: role || 'user'  // Default to 'user' if not provided
        });

        const savedUser = await user.save();

        res.status(201).json({
            message: 'User registered successfully',
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// LOGIN - Authenticate user and get token
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN}
        );

        res.status(200).json({
            message: 'Login successful',
            token,
             user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CHANGE PASSWORD - Update user's password
router.put('/change-password', authenticateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                message: 'Current password and new password are required' 
            });
        }

        // Find user with password
        const user = await User.findById(req.userId);
        
        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');   
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;




