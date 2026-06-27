const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  imagePublicId: {
    type: String,
    default: null
  },

  stock: {
    type: Number,
    default: 0
  },

  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  ratings: {
    type: Number,
    default: 0
  },

  numReviews: {
    type: Number,
    default: 0
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);