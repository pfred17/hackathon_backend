const jwt = require("jsonwebtoken");

const UserSchema = require("../models/user.model");
const AppError = require("../utils/AppError");
const ERROR_CODE = require("../utils/errorCodes");

const protectRoute = async (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(AppError.template(ERROR_CODE.UNAUTHORIZED));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserSchema.findOne({ _id: decoded.userId }).select(
      "-password"
    );
    if (!user) {
      return next(new AppError(ERROR_CODE.NOT_FOUND));
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expired", 401, { code: "UNAUTHORIZED" }));
    }
    if (error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid token", 401, { code: "UNAUTHORIZED" }));
    }
    return next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(AppError.template(ERROR_CODE.FORBIDDEN));
    }
    next();
  };
};

module.exports = { protectRoute, authorize };
