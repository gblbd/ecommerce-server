const express = require("express");
const router = express.Router();

// import controller
const {
  categoryDataUpload,
  categoryDataList,
  deletecategoryData,
  uploadProductsData,
  productListData,
  editProductData,
} = require("../controllers/dashboard");
const { authenticate } = require("../middleware/authurize");

router.post("/category-upload", authenticate, categoryDataUpload);
router.get("/category-data-list", authenticate, categoryDataList);
router.delete("/category-data-delete", authenticate, deletecategoryData);
router.post("/upload-product", authenticate, uploadProductsData);
router.patch("/edit-product", authenticate, editProductData);
router.get("/product-list", productListData);
module.exports = router;
