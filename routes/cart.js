const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authurize");
const {
  addToCart,
  removeFromCart,
  getCart,
  updateCartQuantity,
} = require("../controllers/cart");

router.post("/add-to-cart/:productId", authenticate, addToCart);
router.delete("/remove-from-cart/:productId", authenticate, removeFromCart);
router.get("/get-cart", authenticate, getCart);
router.put("/update-cart-quantity/:cartId", authenticate, updateCartQuantity);

module.exports = router;
