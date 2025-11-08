const express = require("express");
const router = express.Router();

const User = require("../models/user.model");

const { protectRoute } = require("../middlewares/auth.middleware");
const { getChatbotReply } = require("../controllers/chatbot.controller");

// [POST] /api/chat/ask
router.post("/ask", protectRoute, getChatbotReply);

module.exports = router;
