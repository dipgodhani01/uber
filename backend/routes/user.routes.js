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

router.post("/user/register", registerValidation, registerUser);
router.post("/user/login", loginValidation, loginUser);
router.get("/user/profile", authUser, getUserProfile);
router.get("/user/logout", authUser, logoutUser);

module.exports = router;
