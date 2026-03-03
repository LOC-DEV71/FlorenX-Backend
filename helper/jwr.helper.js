const jwt = require("jsonwebtoken");

const createToken = (payload, expires = "7d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expires
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { createToken, verifyToken };