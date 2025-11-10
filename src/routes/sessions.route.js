const express = require("express");
const router = express.Router();
const sessionsController = require("../controllers/sessions.controller");
const upload = require("../middlewares/upload.middleware");

router.post("/", sessionsController.createSession);
router.post("/bulk", sessionsController.bulkCreateSessions);

router.get("/", sessionsController.getAllSessions);

router.get("/:id", sessionsController.getSessionById);

router.put("/:id", sessionsController.updateSession);

router.delete("/:id", sessionsController.deleteSession);

// Cập nhật video cho session (URL + ngôn ngữ)
router.post("/:id/video", sessionsController.setSessionVideo);

// Upload audio và tạo phụ đề (SRT) cho session
router.post(
  "/:id/subtitles",
  upload.single("audio"),
  sessionsController.generateSubtitlesFromAudio
);

module.exports = router;
