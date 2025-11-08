const jwt = require("jsonwebtoken");

const generateAccessToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  return token;
};

const generateRefreshToken = (userId, res) => {
  const freshToken = jwt.sign({ userId }, process.env.JWT_REFRESHTOKEN, {
    expiresIn: "7d",
  });

  res.cookie("refreshToken", freshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
