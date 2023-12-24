const Cart = require("../models/cart");

exports.getCart = async (req, res) => {
  try {
    const result = await Cart.find({
      userId: req.ID,
      orderStatus: false,
    }).populate("userId productId");
    res.status(201).json({ message: "Cart fetch good", result });
  } catch (error) {
    res.status(500).json({ error: "Product cart get failed" });
  }
};

exports.addToCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.ID;
  const { quantity } = req.body;

  try {
    let cartItem = await Cart.findOne({
      userId,
      productId,
      orderStatus: false,
    });

    if (cartItem) {
      cartItem.quantity = quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId,
        productId,
        quantity,
      });
    }

    res.status(201).json({
      message: "Product added to the cart successfully",
      result: cartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Product cart failed" });
  }
};

exports.updateCartQuantity = async (req, res) => {
  const { cartId } = req.params;
  const { quantity } = req.body;

  try {
    let cartItem = await Cart.findById(cartId);

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    console.log(cartItem);

    cartItem.quantity = quantity;
    await cartItem.save();

    res
      .status(200)
      .json({ message: "Cart quantity updated successfully", cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update cart quantity" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await Cart.findByIdAndDelete(productId);
    res
      .status(200)
      .json({ message: "Product removed from the cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
