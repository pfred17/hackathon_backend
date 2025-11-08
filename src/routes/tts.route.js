const express = require("express");
const router = express.Router();
const { convertTextToAudio } = require("../controllers/tts.controller");
const { protectRoute } = require("../middlewares/auth.middleware");

const upload = require("../middlewares/upload.middleware");

router.post(
  "/",
  // protectRoute,
  convertTextToAudio
);

module.exports = router;
