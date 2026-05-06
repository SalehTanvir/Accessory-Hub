const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  getAllUsers,
  deleteUser
} = require("../controllers/userController");

const {
  getAllProductsAdmin,
  deleteProductAdmin
} = require("../controllers/productController");

const {
  getAllOrders
} = require("../controllers/orderController");


// USERS
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// PRODUCTS
router.get("/products", protect, adminOnly, getAllProductsAdmin);
router.delete("/products/:id", protect, adminOnly, deleteProductAdmin);

// ORDERS
router.get("/orders", protect, adminOnly, getAllOrders);

module.exports = router;