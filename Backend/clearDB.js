require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userSchema');
const Project = require('./models/ProjectSchema');
const JoinRequest = require('./models/joinRequestSchema');

async function clearDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear all collections
    await User.deleteMany({});
    await Project.deleteMany({});
    await JoinRequest.deleteMany({});

    console.log('Database cleared successfully!');
    console.log('All users, projects, and join requests have been removed.');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

clearDatabase();