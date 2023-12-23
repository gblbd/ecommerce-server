const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authurize");
const { addToCart, removeFromCart, getCart } = require("../controllers/cart");

router.post("/add-to-cart/:productId", addToCart);
router.delete("/remove-from-cart/:productId", removeFromCart);
router.get("/get-cart", getCart);

module.exports = router;
