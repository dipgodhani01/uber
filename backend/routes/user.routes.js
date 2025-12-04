const express = require("express");
const router = express.Router();
const { registerUser } = require("../controllers/user.controller");
const { registerValidation } = require("../validations/user.validation");

router.post("/users/register", registerValidation, registerUser);

module.exports = router;
