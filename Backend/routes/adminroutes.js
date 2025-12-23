const express = require('express');

const User = require('../models/userSchema');
const Project=require('../models/projectSchema');
const { authenticateToken } = require('../middleware/AuthMiddleware');
const router = express.Router();

/* ================= ADMIN ONLY MIDDLEWARE ================= */

const adminOnly = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access only' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


router.get("/me", authenticateToken, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/add", authenticateToken, adminOnly,async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json({ message: "Project Submitted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




router.get('/users', authenticateToken, adminOnly, async (req, res) => {
    try {
        const { role } = req.query;

        const filter = role ? { role } : {};
        const users = await User.find(filter).select('-password');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;