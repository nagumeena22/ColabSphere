const mongoose = require("mongoose");

const projectViewApplicationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: String,
  github: String,
  linkedin: String,
  experience: String,
  status: {
    type: String,
    enum: ["pending", "interested", "not_interested", "accepted", "rejected"],
    default: "pending"
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "Projectview",
  projectViewApplicationSchema
);
