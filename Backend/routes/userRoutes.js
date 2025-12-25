const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const Project=require('../models/projectSchema');
// ============== CRUD ROUTES WITH MONGODB ==============
router.get('/projects',async(req,res)=>{
    try{
    const data =await Project.find().select("-_id -__v");;
    if(!data || data.length === 0)
    {
        return res.status(404).json({message:"no data available"});
    }
    res.status(200).json(data);
} catch(error){
    res.status(500).json({
        message:"server error",
        error :error.message
    });
}
});
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


module.exports = router;