"use strict";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../model/User.js";
import OtpModel from "../model/Otp.js";
import twilio from "twilio";
import GenerateTokens from "../utils/tokens.js";

const createUser = async (req, res) => {
  const errors = validationResult(req).mapped();

  if (errors.password) {
    return res.status(400).json({
      message: errors.password.msg,
    });
  }

  const { username, mobile, email, password } = req.body;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  const newUser = new UserModel({ username, mobile, email, password });
  await newUser.save();
  res.status(201).json({
    message: "Sign Up successfully",
  });
};

const getUser = async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await UserModel.findOne({ username });

  if (!existingUser) {
    return res.status(404).json({
      message: "User not found!",
    });
  }

  const passwordMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordMatch) {
    return res.status(404).json({
      message: "Invalid Password",
    });
  }

  const tokens = GenerateTokens(existingUser);
  const { accessToken, refreshToken } = tokens;

  res.status(200).json({
    message: "Log In successfully.",
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};

const forgotPassword = async (req, res) => {
  const { mobile } = req.body;

  const existingUser = UserModel.findOne({ mobile });

  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: "User not found!",
    });
  }

  const accountSid = "ACabcab10fc9630154b4e61d8317e5398b";
  const authToken = "95b370b44deb5dffe299e90886003558";
  const fromNumber = "+13028570901";

  const client = twilio(accountSid, authToken);

  const sendSMS = async (body) => {
    let msgOption = {
      from: fromNumber,
      to: `+91${mobile}`,
      body,
    };
    try {
      const message = await client.messages.create(msgOption);
      // console.log(message);
    } catch (error) {
      console.log(error);
    }
  };

  try {
    const generateOTP = () => {
      return new Date().getTime().toString().substring(8, 12);
    };

    const code = generateOTP();
    sendSMS(`CODE:- ${code}`);
    const newCode = new OtpModel({ code, mobile });
    await newCode.save();
    res.status(200).json({
      success: true,
      message: "SMS sent successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyCode = async (req, res) => {
  try {
    const { mobile, code } = req.body;

    const existingOtp = await OtpModel.findOne({ mobile, code });

    if (!existingOtp) {
      res.status(400).json({
        success: false,
        message: "Code not matched! Please try again",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP matched",
    });
  } catch (error) {}
};

const changePassword = async (req, res) => {
  const { passwords, mobile } = req.body;
  const newPassword = passwords.newPassword;
  const confirmPassword = passwords.confirmPassword;

  try {
  } catch (error) {
    return next(error);
  }

  if (newPassword === confirmPassword) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(passwords.newPassword, salt);
      const updateUser = await UserModel.findOneAndUpdate(
        { mobile: mobile },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      if (updateUser) {
        return res
          .status(200)
          .json({ message: "Password updated successfully" });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).json({ message: "Passwords do not match" });
  }
};

export default {
  createUser,
  getUser,
  forgotPassword,
  verifyCode,
  changePassword,
};
