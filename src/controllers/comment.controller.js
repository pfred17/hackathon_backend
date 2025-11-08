const Comment = require("../models/comment.model");

// 🟢 Tạo bình luận
exports.createComment = async (req, res, next) => {
  try {
    const { user, lesson, content } = req.body;
    if (!user || !lesson || !content) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const newComment = new Comment({ user, lesson, content });
    const savedComment = await newComment.save();
    res.status(201).json({ message: "Bình luận thành công", data: savedComment });
  } catch (err) {
    next(err);
  }
};

// 🟡 Lấy tất cả bình luận của một bài học
exports.getCommentsByLesson = async (req, res, next) => {
  try {
    const lessonId = req.params.lessonId;
    const comments = await Comment.find({ lesson: lessonId }).populate("user", "name avatar");
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

// 🔴 Xóa bình luận
exports.deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const deleted = await Comment.findByIdAndDelete(commentId);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy bình luận" });
    res.status(200).json({ message: "Xóa bình luận thành công" });
  } catch (err) {
    next(err);
  }
};