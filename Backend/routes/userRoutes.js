const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const Project = require('../models/ProjectSchema');
const Projectview=require('../models/ViewSchema');
const {  authenticateToken } = require('../middleware/AuthMiddleware');
const JoinRequest = require("../models/joinRequestSchema");
// ============== CRUD ROUTES WITH MONGODB ==============
router.get('/projects',async(req,res)=>{
    try{
    const data =await Project.find().select("-__v"); // Keep _id, remove only __v
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

router.get("/projects", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

router.post("/add", authenticateToken, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json({ message: "Project Submitted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/accept", authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.body;

    const existing = await JoinRequest.findOne({
      projectId,
      userId: req.userId
    });

    if (existing) {
      return res.status(400).json({ message: "Already accepted" });
    }

    const join = new JoinRequest({
      projectId,
      userId: req.userId
    });

    await join.save();
    res.json({ message: "Project accepted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit join request for a project
router.post("/projects/:projectId/join", authenticateToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { message } = req.body;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if user already has a pending or accepted request
    const existingRequest = await JoinRequest.findOne({
      projectId,
      userId: req.userId,
      status: { $in: ["pending", "accepted"] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: "You already have a pending or accepted request for this project" });
    }

    const joinRequest = new JoinRequest({
      projectId,
      userId: req.userId,
      message: message || ""
    });

    await joinRequest.save();
    res.status(201).json({ message: "Join request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Apply to a project (no auth, manual input)
router.post("/project/apply/:projectId", async (req, res) => {
  try {
    const { name, department, email, role, github, linkedin, experience } = req.body;

    if (!name || !department || !email) {
      return res.status(400).json({ message: "Name, department, and email are required" });
    }

    // Prevent duplicate application
    const alreadyApplied = await Projectview.findOne({
      projectId: req.params.projectId,
      email
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied to this project" });
    }

    const application = new Projectview({
      projectId: req.params.projectId,
      name,
      department,
      email,
      role,
      github,
      linkedin,
      experience
    });

    await application.save();

    res.status(201).json({ message: "Application submitted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


/**
 * ✅ APPLY TO PROJECT
 */


/**
 * ✅ USER – ACCEPTED PROJECTS
 */

// READ - Get all users


