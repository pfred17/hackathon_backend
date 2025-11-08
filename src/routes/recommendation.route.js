const express = require("express");
const router = express.Router();
const { getAIRecommendation } = require("../controllers/recommendation.controller");

router.post("/ai-recommend", getAIRecommendation);

module.exports = router;
