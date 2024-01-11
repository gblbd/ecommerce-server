const express = require("express");
const router = express.Router();
const { addCategory, getAllCategories } = require("../controllers/category");

router.post("/add-category", addCategory);
router.get("/get-category", getAllCategories);

module.exports = router;
