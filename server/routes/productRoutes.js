const express = require("express");
const protect = require("../middleware/authMiddleware");
const vendorOnly = require("../middleware/roleMiddleware");
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

module.exports = router;