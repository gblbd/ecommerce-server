const express = require("express");
const router = express.Router();
const {
  addProduct,
  getAllProducts,
  deleteProductById,
} = require("../controllers/product");

router.post("/add-product", addProduct);
router.get("/get-all-products", getAllProducts);
router.delete("/delete-product/:id", deleteProductById);

module.exports = router;
