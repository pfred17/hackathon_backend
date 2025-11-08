const userService = require("../services/auth.service");

const { responseSuccess } = require("../utils/response");

const getAllUser = async (req, res, next) => {
  try {
    const users = await userService.getAllUser();
    responseSuccess(res, "Get all user successfully", users, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUser };
