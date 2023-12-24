const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authurize");
const { postOrder, getOrders } = require("../controllers/order");

router.post("/post-order", authenticate, postOrder);
router.get("/get-orders", authenticate, getOrders);

module.exports = router;
