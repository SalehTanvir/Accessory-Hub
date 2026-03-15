const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },

      vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      quantity: {
        type: Number
      },

      price: {
        type: Number
      }
    }
  ],

  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String
  },

  paymentMethod: {
    type: String,
    default: "COD"
  },

  totalPrice: {
    type: Number,
    required: true
  },

  orderStatus: {
    type: String,
    default: "Pending"
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);