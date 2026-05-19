const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  getAllProductsAdmin
} = require("../controllers/productController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


// =========================
// PUBLIC ROUTES
// =========================
router.get("/", getProducts);


// =========================
// ADMIN ROUTES
// =========================
router.get("/admin", protect, authorizeRoles("admin"), getAllProductsAdmin);


// =========================
// VENDOR ROUTES
// =========================
router.post("/", protect, authorizeRoles("vendor"), upload.single("image"), createProduct);

router.get("/vendor", protect, authorizeRoles("vendor"), getVendorProducts);

router.put("/:id", protect, authorizeRoles("vendor"), upload.single("image"), updateProduct);

router.delete("/:id", protect, authorizeRoles("vendor"), deleteProduct);


// =========================
// PUBLIC SINGLE PRODUCT
// =========================
router.get("/:id", getProductById);


module.exports = router;