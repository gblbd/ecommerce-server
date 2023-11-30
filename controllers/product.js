const { default: axios } = require("axios");
const product = require("../models/product");
const FormData = require("form-data");
const imageHostKey = "79e6ec2db50a9ac8dbdb3b42a1accc92";

exports.addProduct = async (req, res) => {
  try {
    const { title, category, price, details } = req.body;
    console.log("req.files:", req.files);

    // Check if files are present in the request
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    // Create a FormData object and append each image data
    const bodyData = new FormData();
    Object.values(req.files).forEach((file, index) => {
      const imageData = file.data; // Assuming 'data' property contains the image content
      bodyData.append(`image${index}`, file.data, {
        filename: file.name,
        contentType: file.mimetype,
      });
    });

    // Upload the images
    const imgbbResponse = await axios.post(
      `https://api.imgbb.com/1/upload?key=${imageHostKey}`, // Replace with your imgbb API key
      bodyData,
      {
        headers: {
          ...bodyData.getHeaders(), // Include headers from FormData
        },
      }
    );

    const imgbbImageUrls = imgbbResponse.data.data.images.map((img) => img.url);

    // Create a new product with the updated image URLs
    const newProduct = new product({
      title,
      category,
      price,
      details,
      images: imgbbImageUrls,
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
