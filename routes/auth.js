const express = require("express");
const router = express.Router();

// import controller
const {
  signup,
  signin,
  userListData,
  userDelete,
  read,
  userUpdateData,
} = require("../controllers/auth");
const { authenticate } = require("../middleware/authurize");
// import validators
const {
  userSignupValidator,
  userSigninValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators");

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);
router.get("/user-list", userListData);
router.delete("/user-delete", authenticate, userDelete);
router.get("/user-details/:id", authenticate, read);
router.put("/user-update", authenticate, userUpdateData);
module.exports = router;
