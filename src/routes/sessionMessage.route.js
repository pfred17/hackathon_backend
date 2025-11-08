const express = require("express");
const router = express.Router();
const sessionMessageController = require("../controllers/sessionMessage.controller");
const { protectRoute } = require("../middlewares/auth.middleware");

router.get("/:sessionId/messages", sessionMessageController.getSessionMessages);
router.delete("/messages/:messageId", protectRoute, sessionMessageController.deleteMessage);

module.exports = router;