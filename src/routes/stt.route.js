const express = require("express");
const router = express.Router();
const { convertAudioToText } = require("../controllers/stt.controller");
const { protectRoute } = require("../middlewares/auth.middleware");

const upload = require("../middlewares/upload.middleware");

router.post(
  "/upload",
  protectRoute,
  upload.single("audio"),
  convertAudioToText
);

module.exports = router;
