// models/score.model.js
const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  score: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  lastAccessed: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Score", scoreSchema);
