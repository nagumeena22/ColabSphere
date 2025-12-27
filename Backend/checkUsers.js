require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userSchema');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'email regNo name');
    console.log('Total users found:', users.length);

    if (users.length > 0) {
      console.log('Existing users:');
      users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}, RegNo: ${user.regNo}, Name: ${user.name}`);
      });
    } else {
      console.log('No users found in database');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkUsers();