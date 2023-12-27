const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authurize");
const {
  postOrder,
  getOrders,
  getAllOrders,
  deleteOrder,
  getOrderDetails,
} = require("../controllers/order");

router.post("/post-order", authenticate, postOrder);
router.get("/get-orders", authenticate, getOrders);
router.get("/get-all-orders", authenticate, getAllOrders);
router.delete("/delete-orders/:orderId", deleteOrder);
router.delete("/get-single-orders/:orderId", getOrderDetails);

module.exports = router;
