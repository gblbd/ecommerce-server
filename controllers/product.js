const product = require("../models/product");

exports.addProduct = async (req, res) => {
  try {
    const { title, category, price, details, image } = req.body;

    const newProduct = new product({
      title: title,
      category: category,
      price,
      details,
      image,
    });
    await newProduct.save();
    res.json({
      data: newProduct,
      message: "new product added",
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await product.find();
    res.json({
      data: products,
      message: "Products retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({
      data: product,
      message: "Product retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProductById = async (req, res) => {
  try {
    const { title, category, price, details, image } = req.body;
    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      { title, category, price, details, image },
      { new: true } // Return the updated document
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({
      data: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const deletedProduct = await product.findByIdAndRemove(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({
      data: deletedProduct,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
