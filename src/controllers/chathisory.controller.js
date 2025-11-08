const ChatHistory = require("../models/chathisory.model");

// 🟢 Tạo mới lịch sử chat
exports.createChatHistory = async (req, res, next) => {
  try {
    const { user, messages, topic } = req.body;

    const newChat = new ChatHistory({
      user,
      messages,
      topic,
    });

    const savedChat = await newChat.save();
    res.status(201).json({
      message: "Tạo lịch sử chat thành công",
      data: savedChat,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllChatHistories = async (req, res, next) => {
  try {
    const chats = await ChatHistory.find().populate("user", "name email");
    res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};
exports.getChatHistoryById = async (req, res, next) => {
  try {
    const chat = await ChatHistory.findById(req.params.id).populate("user", "name email");
    if (!chat) return res.status(404).json({ message: "Không tìm thấy lịch sử chat" });
    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

exports.updateChatHistory = async (req, res, next) => {
  try {
    const { messages, topic } = req.body;
    const updatedChat = await ChatHistory.findByIdAndUpdate(
      req.params.id,
      { messages, topic },
      { new: true }
    );
    if (!updatedChat) return res.status(404).json({ message: "Không tìm thấy lịch sử chat để cập nhật" });
    res.status(200).json({
      message: "Cập nhật thành công",
      data: updatedChat,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteChatHistory = async (req, res, next) => {
  try {
    const deleted = await ChatHistory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy lịch sử chat để xóa" });
    res.status(200).json({ message: "Xóa lịch sử chat thành công" });
  } catch (error) {
    next(error);
  }
};
