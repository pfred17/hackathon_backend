const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    }, // Liên kết tới môn học
    resources: [
      {
        type: {
          type: String,
          enum: ["text", "audio", "video", "pdf"],
          default: "text",
        },
        url: String,
        // Ngôn ngữ nội dung tài nguyên (ví dụ phụ đề/giọng nói)
        language: {
          type: String,
          enum: ["vi", "en"],
          required: false,
        },
        // Tiêu đề hiển thị (không bắt buộc)
        title: { type: String, required: false },
      },
    ],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Học sinh tham gia
    assignments: [
      {
        title: String,
        description: String,
        dueDate: Date,
      },
    ],
    sessions: [{ type: String, ref: "Session" }], // Liên kết tới session
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", LessonSchema);
module.exports = Lesson;
