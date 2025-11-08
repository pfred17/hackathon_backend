const { body, param, query } = require("express-validator");

exports.registerValidator = [
  body("name").notEmpty().withMessage("Field name is required."),
  body("email").isEmail().withMessage("Invalid email."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
];

exports.loginValidator = [
  body("email").isEmail().withMessage("Invalid email."),
  body("password").notEmpty().withMessage("Password is required."),
];

exports.resetPasswordValidator = [
  query("token").notEmpty().withMessage("Token is required."),
  body("resetPassword").notEmpty().withMessage("New password is required."),
];
