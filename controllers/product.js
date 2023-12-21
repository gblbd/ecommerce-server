const { default: axios } = require("axios");
const product = require("../models/product");
const FormData = require("form-data");
const imageHostKey = "79e6ec2db50a9ac8dbdb3b42a1accc92";

exports.addProduct = async (req, res) => {
  try {
    const { title, category, price, details } = req.body;
    console.log("req.files:", req.body.images);

    let images = [];
    for (let index = 0; index < req.body.images.length; index++) {
      const element = req.body.images[index];

      //let elementData = element.originalName;
      //elementData = elementData.split(".");

      const bodyData = new FormData();
      const imageData = element.split(",")[1].trim();
      bodyData.append("image", imageData);

      // Upload the image
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imageHostKey}`,
        bodyData,
        {
          headers: {
            ...bodyData.getHeaders(), // Include headers from FormData
          },
        }
      );

      const imageUrls = response.data.data.url;

      images.push(imageUrls);
    }

    // Create a new product with the updated image URLs
    const newProduct = new product({
      title,
      category,
      price,
      details,
      images,
    });

    // Save the product to the database
    await newProduct.save();

    res.json({
      data: newProduct,
      message: "New product added with multiple images",
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(400)
      .json({ error: error.message || "An error occurred" });
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
    const deletedProduct = await product.findByIdAndDelete(req.params.id);
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
