const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);

router.get("/my", protect, getMyOrders);

router.get("/vendor", protect, getVendorOrders);

router.put("/:id/status", protect, updateOrderStatus);

module.exports = router;