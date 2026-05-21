const Product = require("../models/Product");
const User = require("../models/User");

const buildVendorDescription = (vendorName, productCount, categories) => {
  const categoryText = categories.length > 0 ? categories.slice(0, 3).join(", ") : "trusted accessories";
  const productText = productCount === 1 ? "1 product" : `${productCount} products`;

  return `${vendorName} offers ${productText} across ${categoryText}.`;
};

exports.getVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" })
      .select("name email role createdAt")
      .sort({ createdAt: -1 });

    const products = await Product.find()
      .populate("vendor", "name email role createdAt")
      .select("name description price category image stock vendor createdAt")
      .sort({ createdAt: -1 });

    const productMap = new Map();

    products.forEach((product) => {
      const vendor = product.vendor;

      if (!vendor || vendor.role !== "vendor") {
        return;
      }

      const vendorId = vendor._id.toString();

      if (!productMap.has(vendorId)) {
        productMap.set(vendorId, {
          productCount: 0,
          categories: new Set(),
          featuredImage: product.image || null,
          products: []
        });
      }

      const vendorEntry = productMap.get(vendorId);
      vendorEntry.productCount += 1;
      vendorEntry.categories.add(product.category);
      vendorEntry.products.push({
        id: product._id,
        name: product.name,
        price: product.price,
        category: product.category,
        image: product.image,
        stock: product.stock,
        description: product.description
      });

      if (!vendorEntry.featuredImage && product.image) {
        vendorEntry.featuredImage = product.image;
      }
    });

    const vendorList = vendors.map((vendor) => {
      const vendorId = vendor._id.toString();
      const productData = productMap.get(vendorId) || {
        productCount: 0,
        categories: new Set(),
        featuredImage: null,
        products: []
      };

      const categories = Array.from(productData.categories);

      return {
        id: vendorId,
        name: vendor.name,
        email: vendor.email,
        joinedAt: vendor.createdAt,
        productCount: productData.productCount,
        categories,
        featuredImage: productData.featuredImage,
        products: productData.products,
        description: buildVendorDescription(vendor.name, productData.productCount, categories)
      };
    });

    res.json(vendorList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVendorById = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.vendorId).select("name email role createdAt");

    if (!vendor || vendor.role !== "vendor") {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const products = await Product.find({ vendor: req.params.vendorId })
      .populate("vendor", "name email role")
      .select("name description price category image stock vendor createdAt")
      .sort({ createdAt: -1 });

    const categories = [...new Set(products.map((product) => product.category).filter(Boolean))];

    res.json({
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        joinedAt: vendor.createdAt,
        productCount: products.length,
        categories,
        description: buildVendorDescription(vendor.name, products.length, categories)
      },
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};