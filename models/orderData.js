const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Define the Mongoose Schema for the Order data
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    postalcode: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
    orderProducts: [
      {
        productId: {
          type: String, // Storing product ID as a string for simplicity
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
      { _id: false },
    ], // Array of OrderProduct subdocuments
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);
orderSchema.set("toObject", { virtuals: true, versionKey: false });
orderSchema.set("toJSON", { virtuals: true, versionKey: false });
// Create the Order model
module.exports = mongoose.model("Order", orderSchema);

// Function to generate a unique 5-digit order ID using uuid
