const express = require("express");
const router = express.Router();

// import controller
const { orderDataUpload } = require("../controllers/orderData");
const { authenticate } = require("../middleware/authurize");

router.post("/order-data-upload", orderDataUpload);

module.exports = router;
