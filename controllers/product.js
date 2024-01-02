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
    console.log("check", req.body);

    let updatedImages = [];

    if (images && images.length > 0) {
      for (let index = 0; index < images.length; index++) {
        const element = images[index];

        if (!element) {
          console.error("Image element is undefined at index:", index);
          continue;
        }

        // Check if the element is in base64 format
        const isBase64 = element.startsWith("data:image");

        if (isBase64) {
          // Process base64 image data
          const bodyData = new FormData();
          const imageData = element.split(",")[1]?.trim();

          if (!imageData) {
            console.error("Image data is undefined at index:", index);
            continue;
          }

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
        } else {
          // Image is sent as a direct name
          updatedImages.push(element);
        }
      }
    }

    // Find the product by ID
    const existingProduct = await product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Remove deleted images from existing images

    // Concatenate the new images and the remaining images
    updatedImages = [...updatedImages];

    // Update the product with new details and images
    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        price,
        details,
        images: updatedImages,
      },
      { new: true } // Return the updated document
    );

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
