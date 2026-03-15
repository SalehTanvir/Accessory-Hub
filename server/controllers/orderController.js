const Order = require("../models/Order");
const Cart = require("../models/Cart");


// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {

    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      vendor: item.product.vendor,
      quantity: item.quantity,
      price: item.price
    }));

    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalPrice: cart.totalPrice
    });

    const savedOrder = await order.save();

    // Clear cart after order
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json(savedOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET LOGGED-IN USER ORDERS
exports.getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({ user: req.user.id })
      .populate("orderItems.product");

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET VENDOR ORDERS
exports.getVendorOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      "orderItems.vendor": req.user.id
    }).populate("orderItems.product");

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = req.body.status;

    await order.save();

    res.status(200).json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};