const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  deleteProductById,
  getProductById,
  updateProductById,
} = require("../controllers/product");

router.post("/add-product", addProduct);
router.get("/get-all-products", getAllProducts);
router.get("/get-single-product/:id", getProductById);
router.delete("/delete-product/:id", deleteProductById);
router.put("/update-product/:id", updateProductById)

module.exports = router;
