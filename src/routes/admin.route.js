const express = require("express");
const router = express.Router();

const User = require("../models/user.model");

const { protectRoute, authorize } = require("../middlewares/auth.middleware");
const { getAllUser } = require("../controllers/admin.controller");

// [GET] /api/admin/user/all
router.get("/user/all", protectRoute, authorize("admin"), getAllUser);

module.exports = router;
