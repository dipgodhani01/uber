const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
} = require("../controllers/user.controller");
const {
  registerValidation,
  loginValidation,
} = require("../validations/user.validation");
const { authUser } = require("../middlewares/auth.middleware");

router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.get("/profile", authUser, getUserProfile);
router.get("/logout", authUser, logoutUser);

module.exports = router;
