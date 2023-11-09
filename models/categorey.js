const mongoose = require("mongoose");

// user schema
const categoreyScheama = new mongoose.Schema(
  {
    categoreyName: {
      type: String,
      trim: true,
      max: 32,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categorey", categoreyScheama);
