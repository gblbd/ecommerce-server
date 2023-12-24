const cart = require("../models/cart");
const Order = require("../models/order");

let orderIdCounter = 200;

exports.postOrder = async (req, res) => {
  const userId = req.ID;
  const orderId = orderIdCounter++;
  try {
    const result = await Order.create({
      orderId: orderId,
      userId: userId,
      cartId: req.body.cartId,
    });

    await cart.updateMany(
      { _id: { $in: req.body.cartId } },
      { $set: { orderStatus: true } }
    );

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Order placement failed" });
  }
};

exports.getOrders = async (req, res) => {
  const userId = req.ID;

  try {
    const orders = await Order.find({ userId: userId }).populate({
      path: "cartId",
      populate: {
        path: "productId",
        model: "Product",
      },
    });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error getting orders by user ID:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
};
