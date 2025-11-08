const express = require("express");
const router = express.Router();
const sessionsController = require("../controllers/sessions.controller");

router.post("/", sessionsController.createSession);
router.post("/bulk", sessionsController.bulkCreateSessions);

router.get("/", sessionsController.getAllSessions);

router.get("/:id", sessionsController.getSessionById);

router.put("/:id", sessionsController.updateSession);

router.delete("/:id", sessionsController.deleteSession);

module.exports = router;

