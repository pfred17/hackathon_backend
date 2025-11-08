const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: String,
    phone: String,
    description: String,
    address: String,
    dateOfBirth: String,
    gender: String,
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["seeker", "employer", "admin"],
      default: "seeker",
    },
    googleId: String,
    resumeUrl: String, // Link CV người tìm việc (nếu có)
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" }, // nếu là employer
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
