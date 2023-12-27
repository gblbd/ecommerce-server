const cart = require("../models/cart");
const Order = require("../models/order");
const moment = require("moment");

exports.postOrder = async (req, res) => {
  const userId = req.ID;
  const currentDateTime = moment().format("YYYY-MM-DD-HH-mm");
  const orderId = `${currentDateTime}`;

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

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate({
        path: "userId",
      })
      .populate({
        path: "cartId",
        populate: {
          path: "productId",
          model: "Product",
        },
      });

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ error: "Failed to get orders" });
  }
};
exports.getOrderDetails = async (req, res) => {
  const orderIdToRetrieve = req.params.orderId;

  try {
    const orderDetails = await Order.findById(orderIdToRetrieve);

    if (!orderDetails) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json({ success: true, data: orderDetails });
  } catch (error) {
    console.error("Error retrieving order details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteOrder = async (req, res) => {
  const orderIdToDelete = req.params.orderId;

  try {
    const deletedOrder = await Order.findByIdAndDelete(orderIdToDelete);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json({ message: "Order deleted successfully", deletedOrder });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
