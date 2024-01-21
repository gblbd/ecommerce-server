const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  deleteProductById,
  getProductById,
  updateProductById,
  checkProductKey,
  topSellingProduct,
} = require("../controllers/product");

router.post("/add-product", addProduct);
router.get("/get-all-products", getAllProducts);
router.get("/get-hot-products", topSellingProduct);
router.get("/checkProductKey/:productKey", checkProductKey);
router.get("/get-single-product/:id", getProductById);
router.delete("/delete-product/:id", deleteProductById);
router.put("/update-product/:id", updateProductById);

module.exports = router;
