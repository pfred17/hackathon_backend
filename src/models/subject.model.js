const mongoose = require("mongoose");

const SubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên môn học
    description: { type: String, default: "" }, // Mô tả môn học
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }], // Danh sách bài học
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Giáo viên phụ trách môn
    status: { type: Boolean, default: true }, // Trạng thái môn học
  },
  { timestamps: true }
);

const Subject = mongoose.model("Subject", SubjectSchema);
module.exports = Subject;
