const express = require("express");
const router = express.Router();
const { createComment, getCommentsByLesson, deleteComment } = require("../controllers/comment.controller");

// Tạo bình luận
router.post("/", createComment);

// Lấy tất cả bình luận theo bài học
router.get("/:lessonId", getCommentsByLesson);

// Xóa bình luận
router.delete("/:id", deleteComment);

module.exports = router;
