class AppError extends Error {
  constructor(
    message,
    statusCode = 500,
    error = { code: "INTERNAL_ERROR", detail: null }
  ) {
    super(message);
    console.log(typeof message);
    this.statusCode = statusCode;
    this.code = error.code;
    this.detail = error.detail;
  }

  static template(template, detail = null) {
    return new AppError(template.message, template.statusCode, {
      code: template.code,
      detail,
    });
  }
}

module.exports = AppError;
