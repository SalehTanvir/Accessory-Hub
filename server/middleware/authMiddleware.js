const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {

    let token;

    // get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // no token
    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user from DB (without password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // attach user to request
    req.user = user;

    next();

  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};
// ROLE CHECK (admin / vendor / user)
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Role (${req.user.role}) not allowed`
      });
    }

    next();
  };
};