const GoldPrice = require("../models/goldprice");
const Product = require("../models/product");

exports.addGoldPrice = async (req, res) => {
  try {
    const { price } = req.body;

    const newGoldPrice = new GoldPrice({ price });
    const savedPrice = await newGoldPrice.save();

    return res.status(201).json(savedPrice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Price added failed" });
  }
};

exports.getGoldPrice = async (req, res) => {
  try {
    const getGoldPrice = await GoldPrice.findOne();

    if (!getGoldPrice) {
      return res.status(404).json({ error: "Gold price not found" });
    }

    return res.json(getGoldPrice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get gold price" });
  }
};

exports.editGoldPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;

    if (!price) {
      return res.status(400).json({ error: "Price not found" });
    }

    // Update the gold price
    const updatedPrice = await GoldPrice.findByIdAndUpdate(
      id,
      { price },
      { new: true }
    );

    if (!updatedPrice) {
      return res.status(404).json({ error: "Price not found" });
    }

    // Get all products
    const allProducts = await Product.find();

    // Iterate through each product and recalculate the price
    for (const product of allProducts) {
      if (product.type === "Gold") {
        // Recalculate price for gold product based on weight and new gold price
        const updatedProductPrice = calculateUpdatedPrice(
          product.weigth,
          price
        );
        // Update product price
        product.price = updatedProductPrice;
        await product.save();
      }
    }

    return res.json(updatedPrice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update price" });
  }
};

const calculateUpdatedPrice = (weightString, newGoldPrice) => {
  const weigth = parseFloat(weightString);

  if (isNaN(weigth)) {
    throw new Error("Invalid weight value");
  }
  const updatedPrice = weigth * newGoldPrice;
  return updatedPrice;
};
