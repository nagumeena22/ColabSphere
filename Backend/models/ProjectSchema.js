const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  adminId: { type: String, default: "ADMIN001" },
  adminName: { type: String, default: "Admin User" },
  department: String,
  branch: String,
  domain: String,
  skillsNeeded: String,
  projectDescription: String,
  competitions: String
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
