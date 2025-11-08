const mongoose = require("mongoose");

const ChatHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Học sinh
    messages: [
      {
        sender: { type: String, enum: ["student", "AI"], required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    topic: { type: String, default: "Chưa xác định" }, // Chủ đề câu hỏi
  },
  { timestamps: true }
);

const ChatHistory = mongoose.model("ChatHistory", ChatHistorySchema);
module.exports = ChatHistory;
