const { validationResult } = require("express-validator");
const ValidationError = require("../utils/ValidationError");
const AppError = require("../utils/AppError");

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let tmp = [];
    errors.array().map((err) => {
      tmp.push(err.msg);
    });
    next(new AppError(tmp, 400, { code: "INVALID_DATA" }));
  }
  next();
};
