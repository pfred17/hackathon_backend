const SessionMessage = require("../models/SessionMessage.model");

exports.createMessage = async (req, res, next) => {
  try {
    const { sessionId, message, messageType = "text", replyTo } = req.body;
    const userId = req.user._id;

    if (!sessionId || !message) {
      return res.status(400).json({ 
        message: "sessionId và message là bắt buộc" 
      });
    }

    const newMessage = new SessionMessage({
      sessionId,
      user: userId,
      message,
      messageType,
      replyTo: replyTo || null,
    });

    await newMessage.save();
    await newMessage.populate("user", "name email avatar");
    
    if (replyTo) {
      await newMessage.populate("replyTo");
    }

    res.status(201).json({
      message: "Tạo tin nhắn thành công",
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSessionMessages = async (req, res, next) => {
    console.log(req.params);
  try {
    const { id } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await SessionMessage.find({ sessionId: id, isDeleted: false })
      .populate("user", "name email avatar")
      .populate({ path: "replyTo", populate: { path: "user", select: "name email avatar" } })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SessionMessage.countDocuments({ sessionId: id, isDeleted: false });

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