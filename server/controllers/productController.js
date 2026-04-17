const Product = require("../models/Product");

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      vendor: req.user.id
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {

    const products = await Product.find().populate("vendor", "name email");

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.vendor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // check ownership
    if (product.vendor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // check if vendor owns this order
    const isVendor = order.orderItems.some(
      item => item.vendor.toString() === req.user.id
    );

    if (!isVendor && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.orderStatus = req.body.status;

    await order.save();

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: GET ALL PRODUCTS
exports.getAllProductsAdmin = async (req, res) => {
  try {

    const products = await Product.find().populate("vendor", "name email");

    res.json(products);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET VENDOR PRODUCTS
exports.getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: DELETE PRODUCT
exports.deleteProductAdmin = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};