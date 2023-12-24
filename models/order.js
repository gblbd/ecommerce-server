const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  cartId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Cart",
  },
  orderId: {
    type: String,
    unique: true,
  },
});
module.exports = mongoose.model("Order", orderSchema);
