const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
        _id: { type: String, required: true },
        title: { type: String, required: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["video", "audio", "text", "pdf"],
      default: "text",
    },
    contentUrl: { type: String, default: "" },
    textContent: { type: String, default: "" },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    }, 
sessionsMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "SessionMessage" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", SessionSchema);
module.exports = Session;
