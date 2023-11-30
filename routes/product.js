const express = require("express");
const router = express.Router();
const { addProduct, getAllProducts } = require("../controllers/product");

router.post("/add-product", addProduct);
router.get("/get-all-products", getAllProducts);

module.exports = router;
