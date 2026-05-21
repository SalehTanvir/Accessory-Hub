const express = require("express");
const router = express.Router();

const { getVendors, getVendorById } = require("../controllers/vendorController");

router.get("/", getVendors);
router.get("/:vendorId", getVendorById);

module.exports = router;