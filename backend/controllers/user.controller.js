const { validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const { createUser } = require("../services/user.service..js");
const blacklistTokenModel = require("../models/blacklistToken.model.js");

module.exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    const hashedPassword = await userModel.hashPasswrod(password);
    const user = await createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
    });
    const token = user.generateAuthToken();
    res.status(201).json({
      status: true,
      message: "User registered successfully.",
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password!",
      });
    }

    const isMatch = await user.comparePasswrod(password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password!",
      });
    }

    const token = user.generateAuthToken();

    res.cookie("token", token);

    res.status(200).json({
      status: true,
      message: "User logged in successfully.",
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      status: true,
      message: "Profile fetched successfully.",
      user: req.user,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
module.exports.logoutUser = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization?.split(" ")[1]) ||
      undefined;

    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Unauthorized!",
      });
    }

    await blacklistTokenModel.create({ token });

    res.clearCookie("token");

    res.status(200).json({
      status: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};
