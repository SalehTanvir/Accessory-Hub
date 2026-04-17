const express = require("express");
const protect = require("../middleware/authMiddleware");
const vendorOnly = require("../middleware/roleMiddleware");
const { getVendorProducts } = require("../controllers/productController");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

router.post("/", createProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/:id", updateProduct);

router.post("/", protect, vendorOnly, createProduct);
router.put("/:id", protect, vendorOnly, updateProduct);
router.delete("/:id", protect, vendorOnly, deleteProduct);
router.get("/vendor", protect, getVendorProducts);

module.exports = router;