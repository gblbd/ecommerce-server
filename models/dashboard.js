const mongoose = require("mongoose");

// user schema
const productDataScheama = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },

    productTitle: {
      type: String,
      trim: true,
    },
    productDetails: {
      type: String,
      trim: true,
    },
    productPrice: {
      type: Number,
      trim: true,
    },

    productDiscount: {
      type: Number,
      trim: true,
    },

    productImage: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductData", productDataScheama);
