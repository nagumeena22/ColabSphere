const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');

// ============== CRUD ROUTES WITH MONGODB ==============

// CREATE - Add a new user
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});




// READ - Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ - Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE - Update user by ID (PUT - full update)
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE - Update user by ID (PATCH - partial update)
router.patch('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE - Delete user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// SEARCH - Search users by name
router.get('/search/name', async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ message: 'Name query parameter is required' });
        }
        const users = await User.find({ name: { $regex: name, $options: 'i' } });
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============== COMMENTED DUMMY DATA ROUTES ==============

/*
const books= [
    { id: 1, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki' , availableCount: 10 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', availableCount:10 },
    { id: 3, title: '1984', author: 'George Orwell',  availableCount:10 },
];

router.get('/', (req, res) => {
    res.status(200).json(books);
});

router.patch('/:id', (req,res)=>{
    const userId = parseInt(req.params.id);
    const {name} = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    if(userIndex === -1){
        return res.status(404).json({message: 'User not found'});
    }
    Object.assign(users[userIndex], {name: name});
    res.json({message: 'User updated successfully'});
});

router.get('/search/:id', (req, res) => {
    const userId = parseInt(req.params.id);  //1
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
});

// Get student/user by name
router.get('/search', (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ message: 'Student name is required' });
    }
    const foundUsers = users.filter(user => 
        user.name.toLowerCase().includes(name.toLowerCase())
    );
    if (foundUsers.length === 0) {
        return res.status(404).json({ message: 'No students found' });
    }
    res.json(foundUsers);
});
*/

module.exports = router;