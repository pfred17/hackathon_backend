const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lession.controller");

router.post("/", lessonController.createLesson); //

router.get("/", lessonController.getAllLessons); //

router.post("/:lessonId/sessions", lessonController.addSessionsToLesson);
// Thêm tài nguyên (ví dụ video) vào một bài học
router.post("/:lessonId/resources", lessonController.addResourcesToLesson);

router.get("/:id", lessonController.getLessonById); //

router.put("/:id", lessonController.updateLesson); //

router.delete("/:id", lessonController.deleteLesson);

module.exports = router;
