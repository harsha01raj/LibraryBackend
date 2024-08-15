const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ Message: "Header is not available" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ Message: "Token is not present in the headers" });
  }
  jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, user) => {
    if (err && !user) {
      return res.status(403).json({ Message: err.message });
    }
    req.user = user;
    console.log(req.user);
    next();
  });
};

module.exports = auth;
