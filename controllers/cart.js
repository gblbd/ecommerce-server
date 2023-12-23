const Cart = require("../models/cart");

exports.getCart = async (req, res) => {
  try {
    const result = await Cart.find({ userId: req.ID }).populate(
      "userId productId"
    );
    res.status(201).json({ message: "Cart fetch good", result });
  } catch (error) {
    res.status(500).json({ error: "Product cart get failed" });
  }
};

exports.addToCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.ID;

  console.log(productId);
  try {
    const findCart = await Cart.findOne({
      userId,
      productId,
    });

    if (findCart) {
      return res.status(409).json({ message: "Product already in cart" });
    }
    const result = await Cart.create({
      userId,
      productId,
    });

    res
      .status(201)
      .json({ message: "Product added to the cart successfully", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Product cart failed" });
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
