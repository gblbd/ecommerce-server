const { default: axios } = require("axios");
const product = require("../models/product");
const FormData = require("form-data");
const order = require("../models/order");
const imageHostKey = "79e6ec2db50a9ac8dbdb3b42a1accc92";

exports.addProduct = async (req, res) => {
  try {
    const {
      title,
      type,
      category,
      productKey,
      price,
      gender,
      quantity,
      weigth,
      details,
    } = req.body;

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
      type,
      category,
      productKey,
      price,
      gender,
      quantity,
      weigth,
      details,
      images,
    });
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
    const {
      title,
      type,
      category,
      productKey,
      price,
      gender,
      quantity,
      weigth,
      details,
      images,
    } = req.body;

    let updatedImages = [];

    if (images && images.length > 0) {
      for (let index = 0; index < images.length; index++) {
        const element = images[index];

        if (!element) {
          console.error("Image element is undefined at index:", index);
          continue;
        }

        const isBase64 = element.startsWith("data:image");

        if (isBase64) {
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
          updatedImages.push(element);
        }
      }
    }

    const existingProduct = await product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    updatedImages = [...updatedImages];

    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        type,
        category,
        productKey,
        price,
        gender,
        quantity,
        weigth,
        details,
        images: updatedImages,
      },
      { new: true }
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
exports.checkProductKey = async (req, res) => {
  const { productKey } = req.params;
  try {
    const existingProduct = await product.findOne({
      productKey: { $regex: new RegExp(productKey, "i") },
    });
    res.json({ available: !existingProduct });
  } catch (error) {
    console.error("Error checking product key availability:", error);
    res.status(500).json({ error: "error getting product key" });
  }
};

exports.checkUpdateProductKey = async (req, res) => {
  const { productKey, currentProductId } = req.query;

  try {
    const existingProduct = await product.findOne({
      _id: { $ne: currentProductId },
      productKey: { $regex: new RegExp(req.params.productKey, "i") },
    });

    res.json({ available: !existingProduct, existingProduct });
  } catch (error) {
    console.error("Error checking product key availability:", error);
    res.status(500).json({ error: "error getting product key" });
  }
};

exports.topSellingProduct = async (req, res) => {
  try {
    const topSellingProducts = await order.aggregate([
      {
        $unwind: "$cartItems",
      },
      {
        $group: {
          _id: "$cartItems.productId",
          totalQuantitySold: { $sum: "$cartItems.quantity" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $sort: { totalQuantitySold: -1 },
      },
      {
        $limit: 6,
      },
    ]);

    res.json(topSellingProducts);
  } catch (error) {
    console.error("Error fetching top-selling products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
