const express = require("express");
const router = express.Router();
const sessionMessageController = require("../controllers/sessionMessage.controller");
const { protectRoute } = require("../middlewares/auth.middleware");

router.post("/messages", protectRoute, sessionMessageController.createMessage);
router.get("/:id/messages", sessionMessageController.getSessionMessages);
router.delete("/messages/:messageId", protectRoute, sessionMessageController.deleteMessage);

module.exports = router;