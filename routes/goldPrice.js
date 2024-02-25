const express = require("express");
const router = express.Router();
const {
  addGoldPrice,
  editGoldPrice,
  getGoldPrice,
} = require("../controllers/goldPrice");

router.get("/get-price", getGoldPrice);
router.post("/post-price", addGoldPrice);
router.put("/edit-price/:id", editGoldPrice);

module.exports = router;
