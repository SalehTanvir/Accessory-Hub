const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
  getOrderById
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createOrder);

router.get("/my", protect, getMyOrders);

router.get("/vendor", protect, getVendorOrders);

router.put("/:id/status", protect, updateOrderStatus);

router.get("/:id", protect, getOrderById);

module.exports = router;