const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    require: true,
  },
  productKey: {
    type: String,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
  weigth: {
    type: String,
    require: true,
  },
  details: {
    type: String,
    require: true,
  },
  images: [
    {
      type: String,
      require: true,
    },
  ],
});

module.exports = mongoose.model("Product", productSchema);
