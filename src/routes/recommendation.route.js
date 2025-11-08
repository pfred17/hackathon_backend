const express = require("express");
const router = express.Router();
const { getAIRecommendation } = require("../controllers/recommendation.controller");

// POST /api/recommend/ai-recommend
router.post("/ai-recommend", getAIRecommendation);

module.exports = router;
