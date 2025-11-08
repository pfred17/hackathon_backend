const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Người bình luận
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true }, // Bài học
    content: { type: String, required: true }, // Nội dung bình luận
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
