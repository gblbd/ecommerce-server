const mongoose = require("mongoose");

// user schema
const productDataScheama = new mongoose.Schema(
  {
    categoreyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categorey",
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
