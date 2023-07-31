const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Order = require("../models/orderData"); // Replace with the correct path to your Order model

// Function to generate a unique 5-digit order ID using uuid
const generateUniqueOrderId = async () => {
  let orderId;
  do {
    orderId = uuidv4().split("-")[0].toUpperCase().substring(0, 5);
  } while (
    orderId.length < 5 ||
    (await Order.findOne({ orderId: orderId }).exec())
  );

  return orderId;
};

exports.orderDataUpload = async (req, res) => {
  try {
    const { userId, orderData, shippingAddress } = req.body;
    console.log(req.body);
    // Generate a unique 5-digit order ID using uuid
    const orderId = await generateUniqueOrderId();

    // Create an array to hold the order product data
    const orderProducts = [];

    for (const data of orderData) {
      const { _id, count } = data;

      // Add the product data to the array
      orderProducts.push({ productId: _id, count });
    }

    // Create a new OrderData object and save it to the database
    const newOrderData = new Order({
      orderId,
      orderProducts,
      userId,
      address: shippingAddress.address,
      phoneNumber: shippingAddress.phoneNumber,
      postalcode: shippingAddress.postalcode,
      city: shippingAddress.city,
      totalAmount: shippingAddress.totalAmount,
    });

    await newOrderData.save();
    console.log("Order data stored successfully!");

    res.json({ message: "Order data saved successfully!" });
  } catch (error) {
    console.error("Error storing order data:", error);
    res.status(500).json({ error: "Error storing order data." });
  }
};
