const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderId: {
      type: String,
      unique: true,
    },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        // totalPrice: Number,
      },
    ],
    subtotal: Number,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Order", orderSchema);
