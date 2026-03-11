const Cart = require("../models/Cart");
const Product = require("../models/Product");


// ADD PRODUCT TO CART
exports.addToCart = async (req, res) => {
  try {

    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [],
        totalPrice: 0
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // product already in cart
      cart.items[itemIndex].quantity += quantity;
    } else {
      // add new product
      cart.items.push({
        product: productId,
        quantity: quantity,
        price: product.price
      });
    }

    // calculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET USER CART
exports.getCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product", "name price image");

    if (!cart) {
      return res.json({ message: "Cart is empty" });
    }

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// REMOVE ITEM FROM CART
exports.removeFromCart = async (req, res) => {
  try {

    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// CLEAR CART
exports.clearCart = async (req, res) => {
  try {

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};