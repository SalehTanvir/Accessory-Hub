const Product = require("../models/Product");
const cloudinary = require("../utils/cloudinary");

const uploadImageToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      return resolve(null);
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "AccessoryHub/products",
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    stream.end(file.buffer);
  });

const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image"
  });
};

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  let uploadedImage = null;

  try {
    uploadedImage = await uploadImageToCloudinary(req.file);
    const image = uploadedImage?.secure_url || req.body.image;

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      image,
      imagePublicId: uploadedImage?.public_id || null,
      vendor: req.user.id
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);

  } catch (error) {
    if (uploadedImage?.public_id) {
      try {
        await deleteImageFromCloudinary(uploadedImage.public_id);
      } catch (cleanupError) {
        console.error("Cloudinary cleanup failed after product create error:", cleanupError.message);
      }
    }

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
  let uploadedImage = null;

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.vendor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const isReplacingImage = Boolean(req.file) || Object.prototype.hasOwnProperty.call(req.body, "image");

    if (req.file) {
      uploadedImage = await uploadImageToCloudinary(req.file);
    }

    const updateData = {
      ...req.body,
      ...(uploadedImage?.secure_url ? { image: uploadedImage.secure_url, imagePublicId: uploadedImage.public_id } : {}),
      ...(isReplacingImage && !req.file && Object.prototype.hasOwnProperty.call(req.body, "image")
        ? { imagePublicId: null }
        : {})
    };

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true
    });

    if (product.imagePublicId && isReplacingImage) {
      try {
        await deleteImageFromCloudinary(product.imagePublicId);
      } catch (cleanupError) {
        console.error("Cloudinary cleanup failed after product update:", cleanupError.message);
      }
    }

    res.json(updatedProduct);

  } catch (error) {
    if (uploadedImage?.public_id) {
      try {
        await deleteImageFromCloudinary(uploadedImage.public_id);
      } catch (cleanupError) {
        console.error("Cloudinary cleanup failed after failed product update:", cleanupError.message);
      }
    }

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

    if (product.imagePublicId) {
      deleteImageFromCloudinary(product.imagePublicId).catch((cleanupError) => {
        console.error("Cloudinary cleanup failed after product delete:", cleanupError.message);
      });
    }

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

    if (product.imagePublicId) {
      deleteImageFromCloudinary(product.imagePublicId).catch((cleanupError) => {
        console.error("Cloudinary cleanup failed after admin product delete:", cleanupError.message);
      });
    }

    res.json({ message: "Product deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};