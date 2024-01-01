const { default: axios } = require("axios");
const product = require("../models/product");
const FormData = require("form-data");
const imageHostKey = "79e6ec2db50a9ac8dbdb3b42a1accc92";

exports.addProduct = async (req, res) => {
  try {
    const { title, category, price, details } = req.body;

    let images = [];
    for (let index = 0; index < req.body.images.length; index++) {
      const element = req.body.images[index];

      const bodyData = new FormData();
      const imageData = element.split(",")[1].trim();
      bodyData.append("image", imageData);

      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imageHostKey}`,
        bodyData,
        {
          headers: {
            ...bodyData.getHeaders(),
          },
        }
      );

      const imageUrls = response.data.data.url;

      images.push(imageUrls);
    }
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

exports.updateProductById = async (req, res) => {
  try {
    const { title, category, price, details, images } = req.body;
    console.log("check",req.body)

    let updatedImages = [];
    if (images && images.length > 0) {
      for (let index = 0; index < images.length; index++) {
        const element = images[index];

        const bodyData = new FormData();
        const imageData = element.split(",")[1].trim();
        bodyData.append("image", imageData);

        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imageHostKey}`,
          bodyData,
          {
            headers: {
              ...bodyData.getHeaders(),
            },
          }
        );

        const imageUrl = response.data.data.url;

        updatedImages.push(imageUrl);
      }
    }

    // Find the product by ID and update its details
    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        price,
        details,
        images
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      data: updatedProduct,
      message: "Product updated successfully",
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
    const findProduct = await product.findById(req.params.id);
    if (!findProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({
      data: findProduct,
      message: "Product retrieved successfully",
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
