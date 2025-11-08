const AppError = require("./AppError");

class ValidationError extends AppError {
  constructor(errors) {
    super(errors, 400);
    this.errors = errors; // mảng lỗi validate.js
  }
}

module.exports = ValidationError;
