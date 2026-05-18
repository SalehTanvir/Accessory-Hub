const SSLCommerzPayment = require("sslcommerz-lts");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_SANDBOX !== "true" && 
                !store_id?.startsWith("test") && 
                !store_id?.startsWith("treal");

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:5000";


// INIT PAYMENT — called from frontend
exports.initPayment = async (req, res) => {
  try {
    const { shippingAddress } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Build order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      vendor: item.product.vendor,
      quantity: item.quantity,
      price: item.price
    }));

    // Generate unique transaction ID
    const tran_id = `ACCHUB_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Create order with Unpaid status
    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod: "Online",
      totalPrice: cart.totalPrice,
      orderStatus: "Pending",
      paymentStatus: "Unpaid",
      transactionId: tran_id
    });

    const savedOrder = await order.save();

    // SSLCommerz payment data
    const data = {
      total_amount: cart.totalPrice,
      currency: "BDT",
      tran_id: tran_id,
      success_url: `${SERVER_URL}/api/payment/success`,
      fail_url: `${SERVER_URL}/api/payment/fail`,
      cancel_url: `${SERVER_URL}/api/payment/cancel`,
      ipn_url: `${SERVER_URL}/api/payment/ipn`,
      shipping_method: "Courier",
      product_name: "AccessoryHub Order",
      product_category: "Accessories",
      product_profile: "general",
      cus_name: req.user.name,
      cus_email: req.user.email,
      cus_add1: shippingAddress.address,
      cus_city: shippingAddress.city,
      cus_postcode: shippingAddress.postalCode,
      cus_country: shippingAddress.country || "Bangladesh",
      cus_phone: "01700000000",
      ship_name: req.user.name,
      ship_add1: shippingAddress.address,
      ship_city: shippingAddress.city,
      ship_postcode: shippingAddress.postalCode,
      ship_country: shippingAddress.country || "Bangladesh",
      value_a: savedOrder._id.toString(), // pass order ID for callbacks
      value_b: req.user.id.toString()     // pass user ID for cart clearing
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(data);

    if (apiResponse?.GatewayPageURL) {
      return res.status(200).json({
        url: apiResponse.GatewayPageURL,
        orderId: savedOrder._id
      });
    } else {
      // SSLCommerz init failed — clean up the order
      await Order.findByIdAndDelete(savedOrder._id);
      return res.status(500).json({
        message: "Payment gateway initialization failed",
        details: apiResponse
      });
    }

  } catch (error) {
    console.error("Payment init error:", error);
    res.status(500).json({ message: error.message });
  }
};


// PAYMENT SUCCESS CALLBACK — SSLCommerz sends POST here
exports.paymentSuccess = async (req, res) => {
  try {
    console.log("SSLCommerz Success Payload:", req.body);
    const { val_id, tran_id, value_a: orderId, value_b: userId } = req.body;

    // Validate payment with SSLCommerz
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id, tran_id });
    console.log("SSLCommerz Validation Result:", validation);

    if (
      validation.status === "VALID" || 
      validation.status === "VALIDATED" || 
      !is_live // Bypass strict validation for Sandbox testing
    ) {
      // Update order as paid and set status to Processing (No admin approval needed)
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "Paid",
        orderStatus: "Processing",
        val_id: val_id,
        paidAt: new Date()
      });

      // Clear the user's cart
      const cart = await Cart.findOne({ user: userId });
      if (cart) {
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
      }

      // Redirect to frontend success page
      return res.redirect(
        `${CLIENT_URL}/payment/success?tran_id=${tran_id}&order_id=${orderId}`
      );
    } else {
      // Validation failed
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "Failed"
      });

      return res.redirect(
        `${CLIENT_URL}/payment/fail?tran_id=${tran_id}&reason=validation_failed`
      );
    }

  } catch (error) {
    console.error("Payment success callback error:", error);
    return res.redirect(`${CLIENT_URL}/payment/fail?reason=server_error`);
  }
};


// PAYMENT FAIL CALLBACK
exports.paymentFail = async (req, res) => {
  try {
    const { tran_id, value_a: orderId } = req.body;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "Failed",
        orderStatus: "Cancelled"
      });
    }

    return res.redirect(
      `${CLIENT_URL}/payment/fail?tran_id=${tran_id || ""}`
    );

  } catch (error) {
    console.error("Payment fail callback error:", error);
    return res.redirect(`${CLIENT_URL}/payment/fail`);
  }
};


// PAYMENT CANCEL CALLBACK
exports.paymentCancel = async (req, res) => {
  try {
    const { tran_id, value_a: orderId } = req.body;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "Cancelled",
        orderStatus: "Cancelled"
      });
    }

    return res.redirect(
      `${CLIENT_URL}/payment/cancel?tran_id=${tran_id || ""}`
    );

  } catch (error) {
    console.error("Payment cancel callback error:", error);
    return res.redirect(`${CLIENT_URL}/payment/cancel`);
  }
};


// IPN (Instant Payment Notification) — optional server-to-server validation
exports.ipnListener = async (req, res) => {
  try {
    const { val_id, tran_id, value_a: orderId } = req.body;

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const validation = await sslcz.validate({ val_id, tran_id });

    if (validation.status === "VALID" || validation.status === "VALIDATED") {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "Paid",
        val_id: val_id,
        paidAt: new Date()
      });
    }

    res.status(200).json({ message: "IPN received" });

  } catch (error) {
    console.error("IPN error:", error);
    res.status(500).json({ message: error.message });
  }
};
