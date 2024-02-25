const mongoose = require("mongoose");

const goldPriceScheama = new mongoose.Schema(
  {
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goldprice", goldPriceScheama);
