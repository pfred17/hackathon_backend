const ValidationError = require("../utils/ValidationError");
const { responseError } = require("../utils/response");
//  AppError(message, httpStatusCode, err)
// err = {
//    code: "USER_EXIST",
//    detail: null hoặc in ra stacktrace chẳng hạn
// }
//  AppError("Invalid user data.", 400, "INVALID_DATA")
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  // err của errorHandler là AppError hoặc ValidationError
  // Nếu lỗi có statusCode (AppError) thì dùng, không thì mặc định 500

  const message = err.message || "Internal Server Error";
  const statusCode = err.statusCode || 500;
  // dành cho client hiển thị cho người dùng
  const errorInfo = {
    code: err.code || "INTERNAL_ERROR",
    detail: err,
  };
  // err.errorCode || "An error occurred, please try again later.";

  if (err instanceof ValidationError) {
    return responseError(res, "Invalid value", err.errors, err.statusCode);
  }

  responseError(res, message, errorInfo, statusCode);

  // res.status(statusCode).json({
  //   success: false,
  //   errorCode,
  //   message,
  //   // chỉ show stack trace khi đang ở development
  //   stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  // });
};

module.exports = errorHandler;
