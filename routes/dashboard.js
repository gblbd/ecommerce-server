const express = require("express");
const router = express.Router();

// import controller
const {
  categoreyDataUpload,
  categoreyDataList,
  deleteCategoreyData,
  uploadProductsData,
  productListData,
  editProductData,
} = require("../controllers/dashboard");
const { authenticate } = require("../middleware/authurize");

router.post("/categorey-upload", authenticate, categoreyDataUpload);
router.get("/categorey-data-list", authenticate, categoreyDataList);
router.delete("/categorey-data-delete", authenticate, deleteCategoreyData);
router.post("/upload-product", authenticate, uploadProductsData);
router.patch("/edit-product", authenticate, editProductData);
router.get("/product-list", productListData);
module.exports = router;
