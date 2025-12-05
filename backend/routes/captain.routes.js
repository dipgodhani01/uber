const express = require("express");
const router = express.Router();
const {
  registerValidation,
  loginValidation,
} = require("../validations/captain.validation");
const {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain,
} = require("../controllers/captain.controller");
const { authCaptain } = require("../middlewares/auth.middleware");

router.post("/register", registerValidation, registerCaptain);
router.post("/login", loginValidation, loginCaptain);
router.get("/profile", authCaptain, getCaptainProfile);
router.get("/logout", authCaptain, logoutCaptain);

module.exports = router;
