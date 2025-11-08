const responseSuccess = (res, message, data, httpStatusCode = 200) => {
  res.status(httpStatusCode).json({
    success: true,
    message,
    data,
    error: null,
  });
};
const responseError = (res, message, err, httpStatusCode = 400) => {
  res.status(httpStatusCode).json({
    success: false,
    message,
    data: null,
    error: {
      code: err.code || "UNKNOWN_ERROR",
      details: err.details || null,
    },
  });
};

module.exports = { responseSuccess, responseError };
