const { validationResult } = require("express-validator");
const { createCaptain } = require("../services/captain.service");
const captainModel = require("../models/captain.model");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;
    const hashedPassword = await captainModel.hashPassword(password);
    const captain = await createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      color: vehicle.color,
      plateNumber: vehicle.plateNumber,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    });
    const token = captain.generateAuthToken();
    res.status(201).json({
      status: true,
      message: "Captain registered successfully.",
      token,
      captain,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.loginCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const captain = await captainModel
      .findOne({
        email,
      })
      .select("+password");

    if (!captain) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password!",
      });
    }

    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password!",
      });
    }

    const token = captain.generateAuthToken();

    res.cookie("token", token);

    res.status(200).json({
      status: true,
      message: "Captain logged in successfully.",
      token,
      captain,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.getCaptainProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      status: true,
      message: "Profile fetched successfully.",
      captain: req.captain,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports.logoutCaptain = async (req, res, next) => {
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
