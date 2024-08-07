const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Middleware to verify the token
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

// Verify token endpoint
router.get("/verify", authMiddleware, (req, res) => {
  res.send(req.user);
});

module.exports = router;
