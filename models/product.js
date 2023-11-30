const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    require: true,
  },
  price: {
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
