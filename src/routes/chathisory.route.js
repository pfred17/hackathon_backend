const express = require("express");
const router = express.Router();
const chatHistoryController = require("../controllers/chathisory.controller");


router.post("/", chatHistoryController.createChatHistory);
router.get("/", chatHistoryController.getAllChatHistories); //

router.get("/:id", chatHistoryController.getChatHistoryById);

router.put("/:id", chatHistoryController.updateChatHistory);
router.delete("/:id", chatHistoryController.deleteChatHistory);//

module.exports = router;
