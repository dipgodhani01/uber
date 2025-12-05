const { body } = require("express-validator");

exports.registerValidation = [
  body("email").isEmail().withMessage("Invalid Email!"),

  body("fullname.firstname")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long!"),

  body("fullname.lastname")
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters long!"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long!"),
];
exports.loginValidation = [
  body("email").isEmail().withMessage("Invalid Email!"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long!"),
];
