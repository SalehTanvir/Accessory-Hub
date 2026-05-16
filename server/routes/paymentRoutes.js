const express = require("express");
const router = express.Router();

const {
  initPayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  ipnListener
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

// Authenticated — user initiates payment
router.post("/init", protect, initPayment);

// Public — SSLCommerz sends POST callbacks
router.post("/success", (req, res, next) => {
  console.log("Payment Success POST reached");
  paymentSuccess(req, res, next);
});

router.post("/fail", (req, res, next) => {
  console.log("Payment Fail POST reached");
  paymentFail(req, res, next);
});

router.post("/cancel", (req, res, next) => {
  console.log("Payment Cancel POST reached");
  paymentCancel(req, res, next);
});

router.post("/ipn", ipnListener);

// Support GET for testing/manual access
router.get("/success", (req, res) => {
  res.send("Success route is working. Use POST for actual payment processing.");
});

module.exports = router;
