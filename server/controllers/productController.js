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
      vendor: req.body.vendor
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

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};