const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;




// 🔗 MongoDB Connection
  // mongoose.connect("mongodb://127.0.0.1:27017/studentDB")
  // .then(() => console.log("MongoDB Connected"))
  // .catch(err => console.log(err));
