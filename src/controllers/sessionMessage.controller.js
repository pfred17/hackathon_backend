const SessionMessage = require("../models/sessionMessage.model");

exports.getSessionMessages = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await SessionMessage.find({
      sessionId,
      isDeleted: false
    })
      .populate("user", "name email avatar")
      .populate("replyTo")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SessionMessage.countDocuments({
      sessionId,
      isDeleted: false
    });

    res.status(200).json({
      messages: messages.reverse(), // Reverse để hiển thị từ cũ đến mới
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await SessionMessage.findOne({
      _id: messageId,
      user: userId
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.isDeleted = true;
    await message.save();

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    next(error);
  }
};