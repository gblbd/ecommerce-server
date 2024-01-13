const express = require("express");
const router = express.Router();
const {
  addCategory,
  getAllCategories,
  editCategory,
} = require("../controllers/category");

router.post("/add-category", addCategory);
router.get("/get-all-category", getAllCategories);
router.put("/edit-category", editCategory);

module.exports = router;
