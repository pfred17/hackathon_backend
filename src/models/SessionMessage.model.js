const mongoose = require("mongoose");

const sessionMessageSchema = new mongoose.Schema(
  {
    sessionId: { 
      type: String, 
      ref: "Session", 
      required: true 
    }, 
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    }, // Người gửi
    message: { 
      type: String, 
      required: true 
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text"
    },
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SessionMessage",
      default: null
    }, // Trả lời message nào
    isEdited: { 
      type: Boolean, 
      default: false 
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

const SessionMessage = mongoose.model("SessionMessage", sessionMessageSchema);
module.exports = SessionMessage;