const vendorOnly = (req, res, next) => {

  if (req.user.role !== "vendor") {
    return res.status(403).json({ message: "Only vendors can add products" });
  }

  next();
};

module.exports = vendorOnly;