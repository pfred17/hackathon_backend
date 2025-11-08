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
      enum: ["teacher", "student", "admin"],
      default: "seeker",
    },
    googleId: String,
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
