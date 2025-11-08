// constants/errorCode.js
const ERROR_CODE = {
  BAD_REQUEST: {
    message: "Invalid request data.",
    statusCode: 400,
    code: "BAD_REQUEST",
  },
  UNAUTHORIZED: {
    message: "Unauthorized access.",
    statusCode: 401,
    code: "UNAUTHORIZED",
  },
  FORBIDDEN: {
    message: "You do not have permission to perform this action.",
    statusCode: 403,
    code: "FORBIDDEN",
  },
  NOT_FOUND: {
    message: "Resource not found.",
    statusCode: 404,
    code: "NOT_FOUND",
  },
  CONFLICT: {
    message: "Resource already exists.",
    statusCode: 409,
    code: "CONFLICT",
  },
  INTERNAL_ERROR: {
    message: "Internal server error.",
    statusCode: 500,
    code: "INTERNAL_ERROR",
  },
};

module.exports = ERROR_CODE;
