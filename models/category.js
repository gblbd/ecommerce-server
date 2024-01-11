const mongoose = require("mongoose");

// user schema
const categoryScheama = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      trim: true,
      max: 32,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categoryScheama);
