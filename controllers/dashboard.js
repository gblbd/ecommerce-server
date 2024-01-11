const { Axios, default: axios } = require("axios");
const Category = require("../models/category");
const ProductsData = require("../models/dashboard");
const FormData = require("form-data");
const imageHostKey = "79e6ec2db50a9ac8dbdb3b42a1accc92";
//create category
exports.categoryDataUpload = async (req, res) => {
  try {
    const { categoryName } = req.body;

    const newPostData = new Category({
      categoryName,
    });
    newPostData.save((err, data) => {
      if (err) {
        return res.status(404).json({ error: err });
      }
      res.json({
        data: data,
        message: "uploaded success!",
      });
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

//show cateorey list

exports.categoryDataList = async (req, res) => {
  try {
    const result = await Category.find({});
    return res.json(result);
  } catch (error) {
    return res.status(400).json(error);
  }
};

//delete cateorey  information from the list
exports.deletecategoryData = async (req, res) => {
  try {
    const id = req.query.id;
    console.log("catory", id);
    await Category.deleteOne({ _id: id });

    res.json({ message: "successfully deleted" });
  } catch (error) {
    res.json({ message: error });
  }
};

/* upload product list */
exports.uploadProductsData = async (req, res) => {
  const {
    categoryId,

    productTitle,
    productDetails,
    productPrice,
    productDiscount,
    productImage,
  } = req.body;

  try {
    // Create a FormData object and append the image data
    const bodyData = new FormData();
    const imageData = productImage.split(",")[1].trim();
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

    // Create and save the news data
    const newPostData = new ProductsData({
      categoryId,

      productTitle,
      productDetails,
      productPrice,
      productDiscount,
      productImage: imageUrls,
    });

    // Save the data using async/await
    const savedData = await newPostData.save();

    res.json({
      data: savedData._id,
      message: "Uploaded successfully!",
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(400)
      .json({ error: error.message || "An error occurred" });
  }
};
//edit product
exports.editProductData = async (req, res) => {
  const {
    categoryId,

    productTitle,
    productDetails,
    productPrice,
    productDiscount,
    productImage,
  } = req.body;
  const { id } = req.query;
  try {
    const existingNewsData = await NewsData.findById(id);

    if (!existingNewsData) {
      return res.status(404).json({ message: "News data not found" });
    }

    // Create a FormData object and append the image data if provided
    const update = {};

    if (categoryId) {
      update.categoryId = categoryId;
    }

    if (productTitle) {
      update.productTitle = productTitle;
    }
    if (productDetails) {
      update.productDetails = productDetails;
    }
    if (productPrice) {
      update.productPrice = productPrice;
    }
    if (productDiscount) {
      update.productDiscount = productDiscount;
    }

    if (productImage) {
      const imageData = productImage.split(",")[1].trim();
      const bodyData = new FormData();
      bodyData.append("image", imageData);

      // Upload the image
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imageHostKey}`,
        bodyData,
        {
          headers: {
            ...bodyData.getHeaders(),
          },
        }
      );

      update.productImage = response.data.data.url;
    }

    const result = await ProductsData.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );

    res.json({
      data: result,
      message: "Updated successfully!",
    });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(400)
      .json({ error: error.message || "An error occurred" });
  }
};

//product list
exports.productListData = async (req, res) => {
  try {
    const test = await ProductsData.find({});

    res.json(test);
  } catch (error) {
    res.json({ message: error });
  }
};
